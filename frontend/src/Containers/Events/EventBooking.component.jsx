// import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import React, { useState } from 'react';
// @mui
import { Box, Card, Paper, Typography, CardHeader, CardContent, Modal, TextField, Rating, Button, Snackbar, Alert } from '@mui/material';
import { useEffect } from 'react';
import axios from "axios";

import LocalActivityIcon from '@mui/icons-material/LocalActivity';

const EventBooking = ({ userData, eventData, setFullPageRefresh, setEventListPageRefresh}) => {
    
    const [seats, setSeats] = useState(null);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackbarData, setSnackbarData] = useState('');

    
    const fetchData = async() => {
        const result = await axios({
            method: "POST",
            url: `http://127.0.0.1:5000/api/user/book_event`,
            // withCredentials: true,
            data: {
                "user_id": userData?.[0]?.[0],
                "show_id": eventData?.row?.show_id,
                "seats": seats
            },
            crossDomain: true,
            headers: {
                "Bypass-Tunnel-Reminder": "*",
            }
        }).catch((error) => {
            console.log("In axios", error.response);
            throw error;
        });

        if(result?.data?.success) {
            console.log(result)
            setShowSnackBar(true);
            setSnackbarData({
                flag: 'success',
                text: "You're all set! See you at the event!"
            })
        } else {
            setShowSnackBar(true);
            setSnackbarData({
                flag: 'error',
                text: result?.data?.error
            })
        }
    }

    const bookSeats = (event) => {
        console.log(seats)
        if(seats && seats > 0) {
            fetchData();
        } else {
            alert('Please enter a valid number of seats')
        }
    }


    const handleSeatsChange = (event) => {
        // console.log(event)
        setSeats(event.target.value);
    }

    return (
        <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Let's get you a ticket for {eventData?.row?.eventName} <Rating name="size-small" defaultValue={eventData?.row?.rating} size="small" readOnly />
            </Typography>
            <Typography id="modal-modal-description" variant="caption" sx={{ mt: 2 }}>
                Event Type: {eventData?.row?.eventType} <br/>
                Event Venue: {eventData?.row?.eventVenue} <br/>
                Event Date: {eventData?.row?.eventDate} <br/>
                Event Time: {eventData?.row?.eventTime} <br/>
                Duration: {eventData?.row?.duration} <br/>
                Price: {eventData?.row?.price} <br/>
                Available Seats: {eventData?.row?.available_seats} <br/>
            </Typography>
            <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'flex-end'}}>
                <Typography id="modal-modal-title" variant="subtitle" component="h4">
                    How many seats would you like?
                </Typography>
                <TextField id="standard-basic" label="Enter the seats" variant="standard" onChange={handleSeatsChange} value={seats} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'flex-end', marginTop: '2em'}}>
                <Button variant="contained" sx={{width: '9em'}}  endIcon={<LocalActivityIcon />} onClick={bookSeats}>Book!</Button>
            </div>
            <Snackbar open={showSnackBar} autoHideDuration={3000} onClose={() => { if(snackbarData.flag == 'success') { setFullPageRefresh(true); setEventListPageRefresh(true); } setShowSnackBar(false) }}>
                <Alert severity={snackbarData.flag} sx={{ width: '90%' }}>
                    {snackbarData.text}
                </Alert>
            </Snackbar>
        </>
    );
}

export default EventBooking;