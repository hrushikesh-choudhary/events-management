// import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
// @mui
// import {
//   Card,
//   Table,
//   Stack,
//   Paper,
//   Avatar,
//   Button,
//   Popover,
//   Checkbox,
//   TableRow,
//   MenuItem,
//   TableBody,
//   TableCell,
//   Container,
//   Typography,
//   IconButton,
//   TableContainer,
//   TablePagination,
//   Icon,
// } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Avatar, Card, Grid } from '@mui/material';
import { useEffect } from 'react';
import axios from "axios";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import UserShowCategoriesChart from './UserShowCategoriesChart.component';
import EventList from '../Events/EventList.component';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}  

const User = ({ userData }) => {
    const [value, setValue] = useState(0);
    const [userBookingMetaData, setUserBookingMetaData] = useState([]);
    const [userUpcomingEvents, setUserUpcomingEvents] = useState([]);
    const [fullpageRefresh, setFullPageRefresh] = useState(false);

    const color = [
        '#264653',
        '#f77f00',
        '#EAB2B7'
    ]
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const fetchData = async() => {
        const result = await axios({
            method: "GET",
            url: `http://127.0.0.1:5000/api/user/events?user_id=${userData?.[0]?.[0]}`,
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
            setUserBookingMetaData([
                result?.data?.bookings?.[0]?.[0],
                result?.data?.bookings?.[0]?.[1],
                result?.data?.payments?.[0]?.[0],
                result?.data?.rent?.[0]?.[0] || 0
            ])
            setUserUpcomingEvents([
                result?.data?.upcoming_events
            ])
            console.log(result?.data?.upcoming_events)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if(fullpageRefresh){
            fetchData();
            setFullPageRefresh(false)
        }
    }, [fullpageRefresh])
  
    return (
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '-webkit-fill-available' }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider', width: '15rem' }}
        >
          {/* <Tab label="Welcome back!" disabled/> */}
          {/* <Tab label={ userData ? userData?.[0]?.[1] : "Name" } icon={<Avatar alt="Name" src={faker.image.avatar()} />} {...a11yProps(0)} /> */}
          <Tab label={ userData ? userData?.[0]?.[1] : "Name" } icon={<Avatar alt="Name" src={"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1014.jpg"} />} {...a11yProps(0)} />
          {
            userBookingMetaData.length && <Tab label={ `${userBookingMetaData[0]} Shows` } style={{color: '#264653'}} disabled /> 
          }
          {
            userBookingMetaData.length && <Tab label={ `${userBookingMetaData[1]} Seats` } style={{color: '#2A9D8F'}} disabled /> 
          }
          {
            userBookingMetaData.length && <Tab label={ `$${userBookingMetaData[2] + userBookingMetaData[3]} spent` } style={{color: '#A155B9'}}  disabled />
          }
          <Tab label="Book More Events!" {...a11yProps(4)}/>
        </Tabs>
        <TabPanel value={value} index={0} style={{width: '-webkit-fill-available'}}>
            <Typography variant="h6">Your upcoming events</Typography>
            <Grid container spacing={6}>
                {
                    userUpcomingEvents.length && userUpcomingEvents[0].length ? userUpcomingEvents[0].map((item, i) => {
                        return (<Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    py: 10,
                                    boxShadow: 0,
                                    textAlign: 'center',
                                    color: 'white',
                                    bgcolor: color[i],
                                    opacity: 0.72
                                }}
                                key={i}
                                >
                                <Typography variant="h4" sx={{borderBottom: '1px solid white', marginBottom: '15px'}}>{item[4]}</Typography>

                                <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                    On {item[0]}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                    At {item[2]}, {item[3]} 
                                </Typography>
                                <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                    {item[5]}<StarBorderIcon sx={{marginTop: '3px'}}/>
                                </Typography>
                                {
                                    item[6] > 1 &&
                                    <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                        <u><i>Do not forget to take your {item[6] - 1} friends with you</i></u>
                                    </Typography>
                                }
                            </Card>
                        </Grid>)
                    }) : 
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                py: 10,
                                boxShadow: 0,
                                textAlign: 'center',
                                color: 'black',
                                bgcolor: 'white',
                                opacity: 0.72
                            }}
                        >
                            <Typography variant="h4" sx={{borderBottom: '1px solid white', marginBottom: '15px'}}>No events!</Typography>

                            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                Try exploring new events.
                            </Typography>
                            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                If you like Music then try Concerts
                            </Typography>
                            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                If you like Drama then try Movies or Plays
                            </Typography>
                            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                If you like Comedy then try Stand-ups
                            </Typography>
                        </Card>
                    </Grid>
                }
            </Grid>
            <UserShowCategoriesChart userData={userData} />
        </TabPanel>
        <TabPanel value={value} index={4} style={{width: '-webkit-fill-available'}}>
            <EventList userData={userData} setFullPageRefresh={setFullPageRefresh} />
        </TabPanel>
      </Box>
    );
}

export default User;