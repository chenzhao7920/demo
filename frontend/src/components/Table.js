import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  TablePagination,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import Client from "../utils/client"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
export default function SelectableTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFields, setSearchFields] = useState({
    address: '',
    latitude: '',
    longitude: '',
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = React.useState(0);
  const [locations, setLocations] = useState([]);
  const handleClickAdd = async(e) =>{
    let fileData = e.target.files[0]
    const formData = new FormData();
    formData.append('file', fileData);
    let apiUrl = `/upload_locations`
    const rep = await Client.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
  }
  const fetchLocations = useCallback(async () => {
    try {
      let apiUrl = `/locations/search?limit=${rowsPerPage}&page=${page+1}`
      if(Object.values(searchFields).filter(e=> !!e).length > 0){
         Object.keys(searchFields).forEach((key) =>(apiUrl += `&${key}=${searchFields[key]}`))
      }
      const {locations, total} = await Client.get(apiUrl);
      setLocations(locations);
      setCount(total)
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  }, [searchFields, page, rowsPerPage])

  // Fetch locations from API on component mount
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleAddSearchTerm = (event) => {
      const{ name, value} = event.target
      setSearchFields((pre) => ({
        ...pre,
        [name]: value
      }))
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p:2 }}>
      <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
        <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: "backgroundColor: '#F3F6F9'"}}>
          <TextField
            variant="outlined"
            name="address"
            placeholder="Address"
            value={searchFields.address}
            onChange={handleAddSearchTerm}
           // onKeyDown={handleAddSearchTerm} // Add term on Enter key
            size="small"
            sx={{backgroundColor: '#F3F6F9'}}
          />
          <TextField
            variant="outlined"
            name="latitude"
            placeholder="Latitude"
            value={searchFields.latitude}
            onChange={handleAddSearchTerm}
            //onKeyDown={handleAddSearchTerm} // Add term on Enter key
            size="small"
            sx={{backgroundColor: '#F3F6F9'}}
          />
          <TextField
            variant="outlined"
            name="longitude"
            placeholder="Longitude"
            value={searchFields.longitude}
            onChange={handleAddSearchTerm}
           // onKeyDown={handleAddSearchTerm} // Add term on Enter key
            size="small"
            sx={{backgroundColor: '#F3F6F9'}}
          />
          <IconButton
             variant="outlined"
             aria-label="search"
             color="primary"
             onClick={handleSearch}
          >
            <SearchRoundedIcon />
          </IconButton>
        </Stack>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload Locations From CSV
          <VisuallyHiddenInput
            type="file"
            onChange={handleClickAdd}
            multiple
          />
        </Button>
      </Stack>
      <TableContainer>
        <Table stickyHeader sx={{ overflow: 'auto', tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '10px' ,fontWeight: 'bold'}}>id</TableCell>
              <TableCell sx={{ width: '70px' ,fontWeight: 'bold'}}>Street</TableCell>
              <TableCell sx={{ width: '50px' ,fontWeight: 'bold'}}>City</TableCell>
              <TableCell sx={{ width: '50px' ,fontWeight: 'bold'}}>County</TableCell>
              <TableCell sx={{ width: '50px' ,fontWeight: 'bold'}}>Country</TableCell>
              <TableCell sx={{ width: '50px' ,fontWeight: 'bold'}}>Zip code</TableCell>
              <TableCell sx={{ width: '40px' ,fontWeight: 'bold'}}>Latitude</TableCell>
              <TableCell sx={{ width: '40px' ,fontWeight: 'bold'}}>Longitude</TableCell>
              <TableCell sx={{ width: '50px' ,fontWeight: 'bold'}}>Timezone</TableCell>
              <TableCell sx={{ width: '50px' ,fontWeight: 'bold'}}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell sx={{ maxWidth: '10px',overflowX: 'auto'}}>{row.id}</TableCell>
                  <TableCell sx={{ maxWidth: '70px',overflowX: 'auto'}}>{row.street}</TableCell>
                  <TableCell sx={{ maxWidth: '50px',overflowX: 'auto'}}>{row.city}</TableCell>
                  <TableCell sx={{ maxWidth: '50px',overflowX: 'auto'}}>{row.county}</TableCell>
                  <TableCell sx={{ maxWidth: '50px',overflowX: 'auto'}}>{row.country}</TableCell>
                  <TableCell sx={{ maxWidth: '40px',overflowX: 'auto'}}>{row.zip_code}</TableCell>
                  <TableCell sx={{ maxWidth: '40px',overflowX: 'auto'}}>{row.latitude}</TableCell>
                  <TableCell sx={{ maxWidth: '40px',overflowX: 'auto'}}>{row.longitude}</TableCell>
                  <TableCell sx={{ maxWidth: '50px',overflowX: 'auto'}}>{row.timezone}</TableCell>
                  <TableCell sx={{ maxWidth: '50px',overflowX: 'auto'}}>{row.score}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    </Paper>
  );


}
