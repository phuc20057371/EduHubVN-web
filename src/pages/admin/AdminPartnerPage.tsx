import { useEffect, useState, useMemo, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { API } from "../../utils/Fetch";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { setPartnerPendingCreate } from "../../redux/slice/PartnerPendingCreateSlice";
import { setPartnerPendingUpdate } from "../../redux/slice/PartnerPendingUpdateSlice";
import PartnerDetailDialog from "../../components/PartnerDetailDialog";
import PartnerDetailUpdateDialog from "../../components/PartnerDetailUpdateDialog";
import PartnerEditDialog from "../../components/PartnerEditDialog";
import type { Partner } from "../../types/Parner";
import { visuallyHidden } from "@mui/utils";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { setPartner } from "../../redux/slice/PartnerSlice";

// Memoized selectors
const selectPartnerPendingCreate = createSelector(
  (state: any) => state.partnerPendingCreate,
  (partnerPendingCreate) =>
    Array.isArray(partnerPendingCreate) ? partnerPendingCreate : [],
);

const selectPartnerPendingUpdate = createSelector(
  (state: any) => state.partnerPendingUpdate,
  (partnerPendingUpdate) =>
    Array.isArray(partnerPendingUpdate) ? partnerPendingUpdate : [],
);

const selectPartners = createSelector(
  (state: any) => state.partner,
  (partner) => (Array.isArray(partner) ? partner : []),
);

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Partner;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "id", numeric: false, disablePadding: true, label: "ID" },
  {
    id: "businessRegistrationNumber",
    numeric: false,
    disablePadding: false,
    label: "Số ĐKKD",
  },
  {
    id: "organizationName",
    numeric: false,
    disablePadding: false,
    label: "Tên tổ chức",
  },
  {
    id: "industry",
    numeric: false,
    disablePadding: false,
    label: "Ngành nghề",
  },
  {
    id: "phoneNumber",
    numeric: false,
    disablePadding: false,
    label: "SĐT",
  },
  {
    id: "website",
    numeric: false,
    disablePadding: false,
    label: "Website",
  },
  { id: "address", numeric: false, disablePadding: false, label: "Địa chỉ" },
  {
    id: "representativeName",
    numeric: false,
    disablePadding: false,
    label: "Đại diện",
  },
  { id: "status", numeric: false, disablePadding: false, label: "Trạng thái" },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Partner,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Partner) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: "#1976d2",
        }}
      >
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 2,
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  onEdit?: () => void;
}

function EnhancedTableToolbar({
  numSelected,
  onEdit,
}: EnhancedTableToolbarProps) {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        },
      ]}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Tổ chức đối tác
      </Typography>
      {numSelected > 0 ? (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit">
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

const AdminPartnerPage = () => {
  const [value, setValue] = useState("1");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<{
    oldData: any;
    newData: any;
  } | null>(null);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Partner>("id");
  const [selected, setSelected] = useState<number | null>(null);

  const partnerPendingCreate = useSelector(selectPartnerPendingCreate);
  const partnerPendingUpdate = useSelector(selectPartnerPendingUpdate);
  const partners = useSelector(selectPartners);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllPartners();
        dispatch(setPartner(res.data.data));
        console.log("All partners:", res.data.data);
        const response = await API.admin.getPartnerPendingCreate();
        dispatch(setPartnerPendingCreate(response.data.data));
        console.log("Partner pending create requests:", response.data.data);
        const updateResponse = await API.admin.getPartnerPendingUpdate();
        dispatch(setPartnerPendingUpdate(updateResponse.data.data));
        console.log(
          "Partner pending update requests:",
          updateResponse.data.data,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error initializing AdminPartnerPage:", error);
      }
    };
    fetchData();
  }, []);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Partner,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = partners.map((n: { id: any }) => n.id);
      setSelected(newSelected.length > 0 ? newSelected[0] : null);
      return;
    }
    setSelected(null);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, row: Partner) => {
    const selectedIndex = selected === row.id ? -1 : row.id;
    if (selectedIndex === -1) {
      setSelected(null);
      return;
    }
    setSelected(selectedIndex);
    console.log(row);
  };

  const visibleRows = useMemo(
    () => [...partners].sort(getComparator(order, orderBy)).slice(),
    [partners, order, orderBy],
  );
  const emptyRows = 10 - visibleRows.length > 0 ? 10 - visibleRows.length : 0;

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Danh sách Đối tác" value="1" />
            <Tab label="Yêu cầu tạo mới" value="2" />
            <Tab label="Yêu cầu cập nhật" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <EnhancedTableToolbar
                numSelected={selected ? 1 : 0}
                onEdit={() => {
                  const partner = partners.find(
                    (p: Partner) => p.id === selected,
                  );
                  setSelectedPartner({ partner });
                  setOpenEditDialog(true);
                }}
              />
              <TableContainer
                sx={{
                  maxHeight: 10 * 53 + 56,
                  width: "100%",
                  overflowY: "auto",
                  overflowX: "auto",
                }}
              >
                <Table
                  sx={{ minWidth: 900, width: "100%" }}
                  aria-labelledby="tableTitle"
                >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={partners.length}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = selected === row.id;
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.id}
                          </TableCell>
                          <TableCell>
                            {row.businessRegistrationNumber}
                          </TableCell>
                          <TableCell>{row.organizationName}</TableCell>
                          <TableCell>{row.industry}</TableCell>
                          <TableCell>{row.phoneNumber}</TableCell>
                          <TableCell>{row.website}</TableCell>
                          <TableCell>{row.address}</TableCell>
                          <TableCell>{row.representativeName}</TableCell>
                          <TableCell>{row.status}</TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53 * emptyRows,
                        }}
                      >
                        <TableCell colSpan={9} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </TabPanel>
        <TabPanel value="2">
          {partnerPendingCreate && partnerPendingCreate.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {partnerPendingCreate.map((item: any, idx: number) => (
                <Box
                  key={item.id || idx}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <strong>{item.organizationName}</strong> <br />
                  <span>
                    Đại diện: {item.representativeName} ({item.position})
                  </span>
                  <br />
                  <span>Năm thành lập: {item.establishedYear}</span>
                  <br />
                  <span>ĐKKD: {item.businessRegistrationNumber}</span>
                  <br />
                  <span>Địa chỉ: {item.address}</span>
                  <br />
                  <span>Điện thoại: {item.phoneNumber}</span>
                  <br />
                  <span>
                    Website:{" "}
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.website}
                    </a>
                  </span>
                  <br />
                  <Box sx={{ mt: 1 }}>
                    <button
                      style={{
                        padding: "6px 16px",
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedPartner(item);
                        setOpenDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <span>Không có yêu cầu tạo mới đối tác.</span>
          )}
          <PartnerDetailDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            partner={selectedPartner || {}}
          />
        </TabPanel>
        <TabPanel value="3">
          {partnerPendingUpdate && partnerPendingUpdate.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {partnerPendingUpdate.map((item: any, idx: number) => {
                const partner = item.partnerOrganization;
                const partnerUpdate = item.partnerOrganizationUpdate;
                if (partner && partnerUpdate) {
                  return (
                    <Box
                      key={item.id || idx}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        height: "100%",
                      }}
                    >
                      <strong>{partner.organizationName}</strong> <br />
                      <span>
                        Đại diện: {partner.representativeName} (
                        {partner.position})
                      </span>
                      <br />
                      <span>Năm thành lập: {partner.establishedYear}</span>
                      <br />
                      <span>ĐKKD: {partner.businessRegistrationNumber}</span>
                      <br />
                      <span>Địa chỉ: {partner.address}</span>
                      <br />
                      <span>Điện thoại: {partner.phoneNumber}</span>
                      <br />
                      <span>
                        Website:{" "}
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {partner.website}
                        </a>
                      </span>
                      <br />
                      <Box sx={{ mt: 1 }}>
                        <button
                          style={{
                            padding: "6px 16px",
                            background: "#1976d2",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedUpdate({
                              oldData: partner,
                              newData: partnerUpdate,
                            });
                            setOpenUpdateDialog(true);
                          }}
                        >
                          Xem chi tiết
                        </button>
                      </Box>
                    </Box>
                  );
                }
                return null;
              })}
              <PartnerDetailUpdateDialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                oldData={selectedUpdate?.oldData}
                newData={selectedUpdate?.newData}
              />
            </Box>
          ) : (
            <span>Không có yêu cầu cập nhật đối tác.</span>
          )}
        </TabPanel>
      </TabContext>

      {/* Dialogs */}
      <PartnerDetailDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        partner={selectedPartner || {}}
      />
      <PartnerDetailUpdateDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        oldData={selectedUpdate?.oldData}
        newData={selectedUpdate?.newData}
      />
      <PartnerEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        partner={selectedPartner?.partner}
      />
    </Box>
  );
};

export default AdminPartnerPage;
