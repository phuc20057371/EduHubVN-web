
import { useEffect, useState, type SyntheticEvent } from "react";

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { API } from "../../utils/Fetch";
import { setLecturerPendingCreate } from "../../redux/slice/LecturerPendingCreateSlice";
import { setLecturerPendingUpdate } from "../../redux/slice/LecturerPendingUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import LecturerDetailDialog from "../../components/LecturerDetailDialog";
import LecturerDetailUpdateDialog from "../../components/LecturerDetailUpdateDialog";
import LecturerUpdateDialog from "../../components/LecturerUpdateDialog";
import { setLecturers } from "../../redux/slice/LecturerSlice";
import type { Lecturer } from "../../types/Lecturer";


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Lecturer;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
  { id: 'fullName', numeric: false, disablePadding: false, label: 'Họ tên' },
  { id: 'academicRank', numeric: false, disablePadding: false, label: 'Học hàm' },
  { id: 'specialization', numeric: false, disablePadding: false, label: 'Chuyên ngành' },
  { id: 'experienceYears', numeric: true, disablePadding: false, label: 'KN (năm)' },
  { id: 'dateOfBirth', numeric: false, disablePadding: false, label: 'Ngày sinh' },
  { id: 'gender', numeric: false, disablePadding: false, label: 'Giới tính' },
  { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'SĐT' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Trạng thái' },
];
interface EnhancedTableProps {

  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Lecturer) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Lecturer) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow sx={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#1976d2' }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ backgroundColor: '#1976d2', color: '#fff', position: 'sticky', top: 0, zIndex: 2 }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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

function EnhancedTableToolbar({ numSelected, onEdit }: EnhancedTableToolbarProps) {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Nutrition
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


const AdminLecturerPage = () => {
  const [value, setValue] = useState('1');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedLecturerCreate, setSelectedLecturerCreate] = useState<any>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedLecturerUpdate, setSelectedLecturerUpdate] = useState<any>(null);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Lecturer>('id');
  const [selected, setSelected] = React.useState<number | null>(null);



  const lecturerCreateList = useSelector((state: any) => Array.isArray(state.lecturerPendingCreate) ? state.lecturerPendingCreate : []);
  const lecturerUpdateList = useSelector((state: any) => Array.isArray(state.lecturerPendingUpdate) ? state.lecturerPendingUpdate : []);
  const lecturers = useSelector((state: any) => state.lecturer || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.admin.getAllLecturers();
        console.log("All lecturers:", res.data.data);
        dispatch(setLecturers(res.data.data));
        const response = await API.admin.getLecturerPendingCreate();
        console.log("Lecturer pending create requests:", response.data.data);
        dispatch(setLecturerPendingCreate(response.data.data));
        const updateResponse = await API.admin.getLecturerPendingUpdate();
        console.log("Lecturer pending update requests:", updateResponse.data.data);
        dispatch(setLecturerPendingUpdate(updateResponse.data.data));

      } catch (error) {
        console.error("Error initializing AdminLecturerPage:", error);
      }
    };

    fetchData();
  }, []);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Lecturer,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = lecturers.map((n: { id: any; }) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected(null);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, row: Lecturer) => {
    const selectedIndex = selected === row.id ? -1 : row.id;
    if (selectedIndex === -1) {
      setSelected(null);
      return;
    }
    setSelected(selectedIndex);
    console.log(row);


  };
  // Chỉ hiển thị tối đa 10 dòng, không còn phân trang
  const visibleRows = React.useMemo(
    () =>
      [...lecturers]
        .sort(getComparator(order, orderBy))
        .slice(),
    [lecturers, order, orderBy],
  );
  const emptyRows = 10 - visibleRows.length > 0 ? 10 - visibleRows.length : 0;
  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Danh sách Giảng viên" value="1" />
            <Tab label="Yêu cầu tạo mới" value="2" />
            <Tab label="Yêu cầu cập nhật" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <EnhancedTableToolbar numSelected={selected ? 1 : 0} onEdit={() => {
                const lecturer = lecturers.find((l: Lecturer) => l.id === selected);
                setSelectedLecturerUpdate({ lecturer });
                setOpenUpdateDialog(true);
              }} />
              <TableContainer sx={{ maxHeight: 10 * 53 + 56, width: '100%', overflowY: 'auto', overflowX: 'auto' }}>
                <Table
                  sx={{ minWidth: 900, width: '100%' }}
                  aria-labelledby="tableTitle"
                >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={lecturers.length}
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
                          sx={{ cursor: 'pointer' }}
                        >
                          {/* Bỏ checkbox, chỉ giữ các cột dữ liệu */}
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.id}
                          </TableCell>
                          <TableCell>{row.fullName}</TableCell>
                          <TableCell>{row.academicRank}</TableCell>
                          <TableCell>{row.specialization}</TableCell>
                          <TableCell align="right">{row.experienceYears}</TableCell>
                          <TableCell>{row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString('vi-VN') : ''}</TableCell>
                          <TableCell>{row.gender ? 'Nam' : 'Nữ'}</TableCell>
                          <TableCell>{row.phoneNumber}</TableCell>
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
              <LecturerUpdateDialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                lecturer={selectedLecturerUpdate?.lecturer}
              />
            </Paper>
          </Box>
        </TabPanel>
        <TabPanel value="2">
          {lecturerCreateList && lecturerCreateList.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              {lecturerCreateList.map((item: any) => (
                <Box key={item.lecturer.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, height: '100%' }}>
                  <strong>{item.lecturer.fullName}</strong> - {item.lecturer.academicRank} ({item.lecturer.specialization})<br />
                  <span>Chuyên ngành: {item.lecturer.specialization}</span><br />
                  <span>Kinh nghiệm: {item.lecturer.experienceYears} năm</span><br />
                  <span>Ngày sinh: {item.lecturer.dateOfBirth}</span> <br />
                  <span>Giới tính: {item.lecturer.gender ? "Nam" : "Nữ"}</span><br />
                  <span>SĐT: {item.lecturer.phoneNumber}</span>
                  <Box sx={{ mt: 1 }}>
                    <button
                      style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedLecturerCreate(item);
                        setOpenCreateDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <span>Không có yêu cầu tạo mới giảng viên.</span>
          )}
          <LecturerDetailDialog
            open={openCreateDialog}
            onClose={() => setOpenCreateDialog(false)}
            lecturer={selectedLecturerCreate?.lecturer || {}}
            degrees={selectedLecturerCreate?.degrees || []}
            certificates={selectedLecturerCreate?.certificates || []}
          />
        </TabPanel>
        <TabPanel value="3">
          {lecturerUpdateList && lecturerUpdateList.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              {lecturerUpdateList.map((item: any) => (
                <Box key={item.lecturer.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, height: '100%' }}>
                  <strong>{item.lecturer.fullName}</strong> - {item.lecturer.academicRank} ({item.lecturer.specialization})<br />
                  <span>Chuyên ngành: {item.lecturer.specialization}</span><br />
                  <span>Kinh nghiệm: {item.lecturer.experienceYears} năm</span><br />
                  <span>Ngày sinh: {item.lecturer.dateOfBirth}</span> <br />
                  <span>Giới tính: {item.lecturer.gender ? "Nam" : "Nữ"}</span><br />
                  <span>SĐT: {item.lecturer.phoneNumber}</span>
                  <Box sx={{ mt: 1 }}>
                    <button
                      style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedLecturerUpdate(item);
                        setOpenUpdateDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <span>Không có yêu cầu cập nhật giảng viên.</span>
          )}
          <LecturerDetailUpdateDialog
            open={openUpdateDialog}
            onClose={() => setOpenUpdateDialog(false)}
            lecturer={selectedLecturerUpdate?.lecturer || {}}
            lecturerUpdate={selectedLecturerUpdate?.lecturerUpdate || {}}
          />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default AdminLecturerPage