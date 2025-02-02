import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { getAllItems } from '../../api/getItem';
import { fetchAllItemsRequest, fetchAllItemsSuccess, fetchAllItemsFailure } from '../../itemSlice';

const ItemsTable = () => {
  const columns = [
    { id: 'guid', label: 'GUID', minWidth: 120 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'path', label: 'Path', minWidth: 150 },
  ];
  
  const createData = (guid, name, path) => {
    return { guid, name, path };
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [itemDetailsData, setItemDetailsData] = React.useState([]);
  const [currentItemId, setCurrentItemId] = React.useState('');
  const [currentItemProperties, setCurrentItemProperties] = React.useState({});
  const [tabValue, setTabValue] = React.useState('1');

  const dispatch = useDispatch();

  const fetchAllItems = () => {
    dispatch(fetchAllItemsRequest());
    return getAllItems()
        .then((allItems) => {
            dispatch(fetchAllItemsSuccess(allItems));
            setItemDetailsData(allItems);
        }, (error) => {
        dispatch(fetchAllItemsFailure(error));
    });
  }

  React.useEffect(() => {
    fetchAllItems();
  }, []);

  const { fetching } = useSelector(state => state.itemDetails);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', margin: '10px', padding: '10px' }}>
        <Backdrop 
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={fetching}
        >
          <CircularProgress color="inherit" />
        </Backdrop> 
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                    sx={{fontWeight: 700, fontSize: '0.95rem'}}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {itemDetailsData.map((item) => (
                createData(item.guid, item.name, `${item.path[0]}/${item.path[1]}`)))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow 
                      hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={row.code} 
                      onClick={
                        () => { 
                          setCurrentItemId(row.guid); 
                          setCurrentItemProperties(
                            itemDetailsData.find((item) => (item.guid === row.guid)).properties);
                        }
                      }
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={itemDetailsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Box sx={{ width: '50%', typography: 'body1', margin: '10px' }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="item tabs">
              <Tab label="Properties" value="1" />
              <Tab label="Image" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            {Object.entries(currentItemProperties).map(([key, value]) => {
              return (
                  <ListItem>
                    <ListItemText primary={ key + ': ' + value}/>
                  </ListItem>
              )
            })}
          </TabPanel>
          <TabPanel value="2"><img src={`http://localhost:8080/image/${currentItemId}`} alt="logo" /></TabPanel>
        </TabContext>
      </Box>
    </>
  )
}

export default ItemsTable;
