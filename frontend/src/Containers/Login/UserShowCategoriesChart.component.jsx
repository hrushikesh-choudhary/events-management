// import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
// @mui
import { Box, Card, Paper, Typography, CardHeader, CardContent } from '@mui/material';
import { useEffect } from 'react';
import axios from "axios";

import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import MicExternalOnOutlinedIcon from '@mui/icons-material/MicExternalOnOutlined';
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import { DataGrid } from '@mui/x-data-grid';

const UserShowCategoriesChart = ({ userData }) => {
    

    const [categorizedData, setCategorizedData] = useState([])
    const [eventsByCategory, setEventsByCategory] = useState([])

    useEffect(() => {
        const fetchData = async() => {
            const result = await axios({
                method: "GET",
                url: `http://127.0.0.1:5000/api/user/event_distribution_by_category?user_id=${userData?.[0]?.[0]}`,
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
                setCategorizedData([
                    {
                        name: "Stand-up",
                        value: result?.data?.events?.[0]?.[1] || 0,
                        icon: <MicExternalOnOutlinedIcon sx={{color: "#4F1BBF"}} />,
                        color: '#4F1BBF'
                    },
                    {
                        name: "Concert",
                        value: result?.data?.events?.[1]?.[1] || 0,
                        icon: <AudiotrackOutlinedIcon sx={{color: '#4ACAD9'}} />,
                        color: '#4ACAD9'
                    },
                    {
                        name: "Play",
                        value: result?.data?.events?.[2]?.[1] || 0,
                        icon: <TheaterComedyOutlinedIcon sx={{color: '#F5B403'}} />,
                        color: '#F5B403'
                    },
                    {
                        name: "Movie",
                        value: result?.data?.events?.[3]?.[1] || 0,
                        icon: <MovieCreationOutlinedIcon sx={{color: '#D91ACC'}} />,
                        color: '#D91ACC'
                    }
                ])
            }
        }
        fetchData();
    }, [])

    const handleCardClick = async(category) => {
        const result = await axios({
            method: "GET",
            url: `http://127.0.0.1:5000/api/user/event_by_category?user_id=${userData?.[0]?.[0]}&event_type=${category}`,
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
            let temp_data = []
            result?.data?.events.map((item, i) => {
                temp_data.push({
                    id: i+1,
                    eventName: item[0],
                    eventType: item[1],
                    eventDuration: item[2],
                    eventOrganizer: item[3]
                })
            })
            setEventsByCategory(temp_data);
        }
    }

    console.log(categorizedData)
    return (
        <div style={{display: 'flex'}}>
            <Card style={{width: '30%', marginTop: '2em', boxShadow: 'none'}}>
                <CardHeader title={''} subheader={'Event Attended/Booked'} />

                <CardContent>
                    <Box
                    sx={{
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: 'repeat(2, 1fr)',
                    }}
                    >
                    {categorizedData && categorizedData.map((site) => (
                        <Paper key={site.name} variant="outlined" sx={{ py: 2.5, textAlign: 'center', borderColor: site.color }} onClick={() => handleCardClick(site.name)}>
                            <Box sx={{ mb: 0.5 }}>{site.icon}</Box>

                            <Typography variant="h6" sx={{color: site.color}}>{site.value}</Typography>

                            <Typography variant="body2" sx={{ color: site.color }}>
                                {site.name}
                            </Typography>
                        </Paper>
                    ))}
                    </Box>
                </CardContent>
            </Card>
            {
                eventsByCategory &&
                <Box sx={{ height: 450, width: '65%', marginLeft: '4em', marginTop: '2em' }}>
                    <DataGrid
                        rows={eventsByCategory}
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
                                field: 'eventDuration',
                                headerName: 'Event Duration (in mins)',
                                type: 'number',
                                width: 175,
                            },
                            {
                                field: 'eventOrganizer',
                                headerName: 'Event Organizer (Company)',
                                width: 170,
                            },
                        ]}
                        // pageSize={5}
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        // checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
            }
        </div>
    );
}

export default UserShowCategoriesChart;