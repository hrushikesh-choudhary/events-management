// import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
// @mui
import { Box, Card, Paper, Typography, CardHeader, CardContent, Modal } from '@mui/material';
import { useEffect } from 'react';
import axios from "axios";

import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import MicExternalOnOutlinedIcon from '@mui/icons-material/MicExternalOnOutlined';
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import { DataGrid } from '@mui/x-data-grid';
import EventBooking from './EventBooking.component';

const EventList = ({ userData, setFullPageRefresh }) => {
    

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [eventParams, setEventParams] = useState({});
    const [eventListPageRefresh, setEventListPageRefresh] = useState(false);

    const fetchData = async() => {
        const result = await axios({
            method: "GET",
            url: `http://127.0.0.1:5000/api/user/events_list?user_id=${userData?.[0]?.[0]}`,
            // withCredentials: true,
            crossDomain: true,
            headers: {
                "Bypass-Tunnel-Reminder": "*",
            }
        }).catch((error) => {
            console.log("In axios", error.response);
            throw error;
        });

        if(result?.data?.success) {
            console.log("YAY");
            let temp = [];
            JSON.parse(result?.data?.events).map((item, i) => {
                temp.push({
                    id: i,
                    eventName: item?.[0],
                    eventType: item?.[1],
                    eventVenue: item?.[2],
                    eventDate: item?.[3],
                    eventTime: item?.[4],
                    duration: item?.[5],
                    price: item?.[6],
                    available_seats: item?.[7],
                    rating: item?.[8],
                    show_id: item?.[9]
                })
            })
            setEvents(temp);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if(eventListPageRefresh) {
            fetchData();
            setEventListPageRefresh(false);
        }
    }, [eventListPageRefresh]);

    const handleRowClick = (params) => {
        console.log(params)
        setEventParams(params)
        setShowModal(true);
    }

    return (
        <div style={{display: 'flex'}}>
            {
                events &&
                <Box sx={{ height: 650, width: '100%', marginLeft: '4em' }}>
                    <DataGrid
                        rows={events}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 90 },
                            {
                                field: 'eventName',
                                headerName: 'Event name',
                                width: 250,
                            },
                            {
                                field: 'eventType',
                                headerName: 'Event Type',
                                width: 130,
                            },
                            {
                                field: 'eventVenue',
                                headerName: 'Event Venue',
                                width: 130,
                            },
                            {
                                field: 'eventDate',
                                headerName: 'Event Date',
                                width: 130,
                            },
                            {
                                field: 'eventTime',
                                headerName: 'Event Time',
                                width: 130,
                            },
                            {
                                field: 'duration',
                                headerName: 'Duration',
                                type: 'number',
                                width: 175,
                            },
                            {
                                field: 'price',
                                headerName: 'Price',
                                width: 170,
                            },
                            {
                                field: 'available_seats',
                                headerName: 'Available seats',
                                width: 170,
                            },
                            {
                                field: 'rating',
                                headerName: 'Rating',
                                width: 170,
                            },
                        ]}
                        // pageSize={10}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        experimentalFeatures={{ newEditingApi: true }}
                        onRowClick={handleRowClick}
                        
                    />
                    <Modal
                        open={showModal}
                        onClose={() => setShowModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 600,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            height: 350
                        }}>
                            <EventBooking userData={userData} eventData={eventParams} setFullPageRefresh={setFullPageRefresh} setEventListPageRefresh={setEventListPageRefresh} />
                        </Box>
                    </Modal>
                </Box>
            }
        </div>
    );
}

export default EventList;