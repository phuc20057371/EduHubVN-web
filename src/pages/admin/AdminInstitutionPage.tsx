import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { API } from "../../utils/Fetch";
import { setInstitutionPendingCreate } from "../../redux/slice/InstitutionPendingCreateSlice";
import { setInstitutionPendingUpdate } from "../../redux/slice/InstitutionPendingUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import InstitutionDetailDialog from "../../components/InstitutionDetailDialog";
import InstitutionDetailUpdateDialog from "../../components/InstitutionDetailUpdateDialog";
import type { Institution } from "../../types/Institution";
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
import { setInstitutions } from "../../redux/slice/InstitutionSlice";
import InstitutionEditDialog from "../../components/InstitutionEditDialog";

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
  id: keyof Institution;
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
    id: "institutionName",
    numeric: false,
    disablePadding: false,
    label: "Tên CSGD",
  },
  {
    id: "institutionType",
    numeric: false,
    disablePadding: false,
    label: "Loại",
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
    property: keyof Institution,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Institution) => (event: React.MouseEvent<unknown>) => {
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
        Trường/Trung tâm đào tạo
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

// Helper function để hiển thị tên loại cơ sở giáo dục
const getInstitutionTypeDisplay = (type: string) => {
  switch (type) {
    case 'UNIVERSITY':
      return 'Trường';
    case 'TRAINING_CENTER':
      return 'TTDT';
    default:
      return type;
  }
};

const AdminInstitutionPage = () => {
  const [value, setValue] = useState("1");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);


  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Institution>("id");
  const [selected, setSelected] = useState<number | null>(null);

  const [selectedUpdate, setSelectedUpdate] = useState<{
    oldData: any;
    newData: any;
  } | null>(null);
  const institutionPendingCreate = useSelector((state: any) =>
    Array.isArray(state.institutionPendingCreate)
      ? state.institutionPendingCreate
      : [],
  );
  const institutionPendingUpdate = useSelector((state: any) =>
    Array.isArray(state.institutionPendingUpdate)
      ? state.institutionPendingUpdate
      : [],
  );
  const institutions = useSelector((state: any) =>
    Array.isArray(state.institution) ? state.institution : [],
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllInstitutions();
        dispatch(setInstitutions(res.data.data));
        const response = await API.admin.getInstitutionPendingCreate();
        dispatch(setInstitutionPendingCreate(response.data.data));
        console.log("Institution pending create requests:", response.data.data);
        const updateResponse = await API.admin.getInstitutionPendingUpdate();
        dispatch(setInstitutionPendingUpdate(updateResponse.data.data));
        console.log(
          "Institution pending update requests:",
          updateResponse.data.data,
        );
        console.log(
          "Institution pending update requests:",
          updateResponse.data.data,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error initializing AdminInstitutionPage:", error);
      }
    };
    fetchData();
  }, []);
  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Institution,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = institutions.map((n: { id: any }) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected(null);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, row: Institution) => {
    const selectedIndex = selected === row.id ? -1 : row.id;
    if (selectedIndex === -1) {
      setSelected(null);
      return;
    }
    setSelected(selectedIndex);
    console.log(row);
  };
  // Chỉ hiển thị tối đa 10 dòng, không còn phân trang
  const visibleRows = useMemo(
    () => [...institutions].sort(getComparator(order, orderBy)).slice(),
    [institutions, order, orderBy],
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
            <Tab label="Danh sách Cơ sở" value="1" />
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
                  const institution = institutions.find(
                    (l: Institution) => l.id === selected,
                  );
                  setSelectedInstitution({ institution });
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
                    rowCount={institutions.length}
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
                          {/* Bỏ checkbox, chỉ giữ các cột dữ liệu */}
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
                          <TableCell>{row.institutionName}</TableCell>
                          <TableCell>
                            {getInstitutionTypeDisplay(row.institutionType)}
                          </TableCell>
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
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <InstitutionUpdateDialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                institution={selectedInstitution?.institution}
              /> */}
            </Paper>
          </Box>
        </TabPanel>
        <TabPanel value="2">
          {institutionPendingCreate && institutionPendingCreate.length > 0 ? (
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
              {institutionPendingCreate.map((item: any, idx: number) => (
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
                  <strong>{item.institutionName}</strong>{" "}
                  <span style={{ color: "#888", fontWeight: 400 }}>
                    ({getInstitutionTypeDisplay(item.institutionType)})
                  </span>
                  <br />
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
                        setSelectedInstitution(item);
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
            <span>Không có yêu cầu tạo mới cơ sở.</span>
          )}
         
        </TabPanel>
        <TabPanel value="3">
          {institutionPendingUpdate && institutionPendingUpdate.length > 0 ? (
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
              {institutionPendingUpdate.map((item: any, idx: number) => {
                const edu = item.educationInstitution;
                const eduUpdate = item.educationInstitutionUpdate;
                if (edu && eduUpdate) {
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
                      <strong>{edu.institutionName}</strong>{" "}
                      <span style={{ color: "#888", fontWeight: 400 }}>
                        ({getInstitutionTypeDisplay(edu.institutionType)})
                      </span>
                      <br />
                      <span>
                        Đại diện: {edu.representativeName} ({edu.position})
                      </span>
                      <br />
                      <span>Năm thành lập: {edu.establishedYear}</span>
                      <br />
                      <span>ĐKKD: {edu.businessRegistrationNumber}</span>
                      <br />
                      <span>Địa chỉ: {edu.address}</span>
                      <br />
                      <span>Điện thoại: {edu.phoneNumber}</span>
                      <br />
                      <span>
                        Website:{" "}
                        <a
                          href={edu.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {edu.website}
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
                              oldData: edu,
                              newData: eduUpdate,
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
             
            </Box>
          ) : (
            <span>Không có yêu cầu cập nhật cơ sở.</span>
          )}
        </TabPanel>
      </TabContext>

      {/* Dialogs */}
      <InstitutionDetailDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        institution={selectedInstitution || {}}
      />
      <InstitutionDetailUpdateDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        oldData={selectedUpdate?.oldData}
        newData={selectedUpdate?.newData}
      />
      <InstitutionEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        institution={selectedInstitution?.institution}
      />
    </Box>
  );
};

export default AdminInstitutionPage;
