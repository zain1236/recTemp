import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid} from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { AppContext } from "../Context";
import Loader from "../Loader";


export const Dashboard = (props) => {
  const [ids,setIds] = useState('');
  const {userData,setErpId} = useContext(AppContext);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchArrays = async () => {
      try {
        setLoading(true);
        const url = 'https://erpweb.fusionlogics.com/email-service/public/glc_teachers_list';
        const response2 = await axios.get(url);
        
        const url1 = process.env.REACT_APP_HOST + '/rec/ids'
        const token = userData.Token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response1 = await axios.get(url1);
        
        const map2 = new Map(response2.data.map(item => [item.emp_code, item]));
        const mergedArray = [];
        response1.data.Ids.forEach(item => {
          const idVal = item.id;
          item.date = item.last_seen.slice(0, 10);
          item.time = item.last_seen.slice(11, 19);
          if (map2.has(idVal)) {
            const { emp_name,department_name,designation_desc,gender_desc,shift_name} = map2.get(idVal);
            const mergedItem = { ...item, emp_name,department_name,designation_desc,gender_desc,shift_name };
            mergedArray.push(mergedItem);
          }
          else{
            mergedArray.push(item);
          }
        });
        console.log(mergedArray);
        setIds(mergedArray);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchArrays();
  },[userData]);

  // useEffect(()=> {
  //   const url = process.env.REACT_APP_HOST + '/rec/ids'
  //   const token = userData.Token;
  //   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  //   axios.get(url)
  //     .then(resp => {
  //       if(resp.data.Message === 'success'){
  //         setIds(resp.data.Ids);
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
 
  // },[])

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateWithinTwoDays = (givenDate) => {
    const date = new Date(givenDate);
    const differenceInMilliseconds = new Date() - date;
    const twoDaysInMilliseconds = 4 * 24 * 60 * 60 * 1000;
    return differenceInMilliseconds < twoDaysInMilliseconds;
  };

  const handleIdClick  = (id) => {
    setErpId(id);
  } 

  const columns = [
    { 
      field: 'id', headerName: 'ERP ID', flex: 0.5,
      renderCell: (params) => {
        return (
          <Link to={'/rec'} onClick={() => handleIdClick(params.value) } >
            {params.value}
          </Link>
        )}
      ,
    },
    { field: 'emp_name', headerName: 'Emp Name', flex: 2 },
    { field: 'department_name', headerName: 'Department', flex: 1 },
    { field: 'designation_desc', headerName: 'Designation', flex: 1 },
    { field: 'gender_desc', headerName: 'Gender', flex: 1 },
    { field: 'shift_name', headerName: 'Shift', flex: 1 },
    { field: 'no_of_files', headerName: 'Number of Files', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1,
      renderCell: (params) =>{
        if ( params.value === getTodayDate() ){
          return(
            <div style={{backgroundColor:'lightgreen'}}>
              {params.value}
            </div>
        )}
        else if ( isDateWithinTwoDays(params.value) ){
          return(
            <div style={{backgroundColor:'yellow'}}>
              {params.value}
            </div>
        )}
      }
    },
    { field: 'time', headerName: 'Time', flex: 1 },
  ];

  return (
    loading ?         
      <Loader />
    :
    <div>
        <h2 style={{ textAlign: 'center', margin: '20px 0', fontFamily: 'Montserrat, sans-serif' }}>
        ERP IDS
      </h2>
        <DataGrid
          columns={columns}
          rows={ids}
          disableSelectionOnClick
          autoHeight
          sx={{
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: '#fff',
              fontWeight: 'bold',
            },
            height : '90vh',
            margin : 2
          }}
          // rowsPerPageOptions={[5, 10, 20]}
          // disableSelectionOnClick
      />
    </div>
  )
}
