import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import AudioPlayer from '../AudioPlayer';
import { AppContext } from "../Context";
import Loader from '../Loader';
export default function Recordings() {
    const {erpId,userData} = useContext(AppContext);
    const [recData,setRecData] = useState();
    const [loading,setLoading] = useState(true);
    const [selectedRec,setSelectedRec] = useState(false);
    const [url,setUrl] = useState();
    const [audioKey, setAudioKey] = useState(0);

    const formatDate = (originalDate) => {
        const [day, month, year] = originalDate.split('_');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        return formattedDate;
    };

    const formatTime = (givenTime) =>{
        const [hours, minutes,secs] = givenTime.split('_');
        const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${secs.padStart(2, '0')}`;
        return formattedTime;
    }


    useEffect(()=> {
        const fetchArrays = async () => {
            try{
                setLoading(true);
                if (userData){
                    const url1 = process.env.REACT_APP_HOST + '/rec/' + erpId;
                    const token = userData.Token;
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                

                    const resp1 = await axios.get(url1);
                    
                    if ( resp1.data.Message === 'success' ){
                        const mergedArray = [];
                        console.log(recData);
                        // for (let index = 0; index < resp1.data.Rec.length; index++) {
                        //     const item = resp1.data.Rec[index];
                        //     const url2 = 'https://erpweb.fusionlogics.com/email-service/public/glc_show_class_attendance/' + formatDate(item.date) + '/' + erpId;
                        //     const resp2 = await axios.get(url2);
                        //     console.log(item.id,resp2.data);
                        //     const {student_name} = resp2.data[0];
                        //     const mergedItem = { ...item, student_name };
                        //     mergedArray.push(mergedItem);
                        // }
                        setRecData(resp1.data.Rec);
                        setLoading(false);
                    }
                    else{
                        alert(resp1.data.Message);
                    }
                        
                }

            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchArrays();
      },[])
    

    const handleDownload = (fileName) => {
        const url = process.env.REACT_APP_HOST + `/rec/download/${erpId}/${fileName}`;
        const token = userData.Token;

        axios
        .get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'blob',
        })
        .then((response) => {
            const blobURL = URL.createObjectURL(response.data);
            console.log(blobURL);
            const link = document.createElement('a');
            link.href = blobURL;
            link.download = fileName;
            link.click();

            // Clean up the temporary URL
            URL.revokeObjectURL(blobURL);
        })
            .catch((error) => {
            alert(error);
        });
    };
    
    const columns = [
        { field: 'id', headerName: 'Rec ID', flex: 1 },
        // { field: 'file_name', headerName: 'Recording', flex: 2 },
        // {
        //     field: 'file_name',
        //     headerName: 'Rec',
        //     flex: 2,
        //     renderCell:  (params) => {
        //         const fileName = params.value;
        //         const token = userData.Token;
        //         const url = `${process.env.REACT_APP_HOST}/rec/download/${erpId}/${fileName}`;
            
        //         return (
        //             <div style={{paddingTop : '20px',paddingBottom : "20px"}} >
        //                 {/* {fileName} */}
        //                 <AudioPlayer fileUrl={url} token={token}/>
        //             </div>
        //         );
        //     },
        // },
        { field: 'duration', headerName: 'Duration', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'time', headerName: 'Time', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => {
                const fileName = params.row.file_name;
                return (
                    <button onClick={() => handleDownload(fileName)}>Download</button>
                );
            },
        },
        
    ];
    
    const handleRowClick = async (params) => {
        console.log(params.row);
        setSelectedRec(params.row);
        setAudioKey((prevKey) => prevKey + 1);
        setUrl(`${process.env.REACT_APP_HOST}/rec/download/${erpId}/${params.row.file_name}`)

        // const url2 = 'https://erpweb.fusionlogics.com/email-service/public/glc_show_class_attendance/' + formatDate(params.row.date) + '/' + erpId;
        // const resp2 = await axios.get(url2);
        // console.log(resp2.data);
        // const {student_name} = resp2.data[0];
    };
    
      
    if (erpId)
    {
        return (
            <div>
                <h2 style={{ textAlign: 'center', margin: '20px 0', fontFamily: 'Montserrat, sans-serif' }}>
                    Showing Results Of <strong>{erpId}</strong>
                </h2>

                <div style={{display:'flex',height: '75vh'}}>
                    <div style={{flex:'50%',backgroundColor:'lightgreen'}} >
                        {selectedRec ? (
                            <div>
                                <div style={{ backgroundColor:"blue",color:'white',textAlign :"center" }}>
                                    <h1>RECORDING ID  {selectedRec['id']}</h1>
                                </div>

                                <div style={{display:'flex',alignItems:'center',}}>
                                   <div>
                                        <h2>Your Heading</h2>
                                        <span style={{marginRight:'10px'}}>Your Additional Content</span>
                                    </div>
                                        {/* <span> <h3>Size </h3> {selectedRec.size} mb</span>
                                        <h3>Date </h3> <span>{selectedRec.date} <h3>{formatTime(selectedRec.time) }</h3> </span> */}

                                </div>
                                <div style={{textAlign:'center',padding:'10vh'}}>
                                    Student Name Zain Ul Abideen
                                </div>
                                <div style={{textAlign:'center',padding:"10vh"}}>
                                    { url && <AudioPlayer key={audioKey} fileUrl={url} token={userData.Token} /> }
                                </div>
                            </div>
                         ) : ""
                        }
                    </div>

                    <div style={{flex:'50%',height:'75vh'}}>
                        
                        {recData ?
                            <DataGrid
                                rows={recData}
                                columns={columns}
                                // disableSelectionOnClick
                                onRowClick={handleRowClick}
                                // autoHeight
                                sx={{
                                    '& .MuiDataGrid-columnHeader': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    },
                                    height : '75vh',
                                    // margin : 2
                                    marginLeft : 1,
                                    marginRight:1,
                                }}
                                                
                            />
                            : ""
                        }
                    </div>
                </div>
            </div>
        )
    }
    else{
        return (
            <h2 style={{ textAlign: 'center', margin: '20px 0', fontFamily: 'Montserrat, sans-serif' }}>
                Please Select Erp Id
            </h2>
        )
    }
}

