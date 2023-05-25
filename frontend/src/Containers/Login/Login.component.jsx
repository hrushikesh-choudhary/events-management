import React, { useState } from "react";
import ReactDOM from "react-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Avatar, Button, Container, CssBaseline, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Paper, Typography } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Face5Icon from '@mui/icons-material/Face5';
import CelebrationIcon from '@mui/icons-material/Celebration';
import axios from "axios";
import User from "./User.component";


const Login = (props) => {
    
    const [email, setEmail] = useState('cimlinhj@discovery.com')
    const [password, setPassword] = useState('a6ba0519-58ef-45cd-bf32-2c4c1b82246c');
    const [showPassword, setShowPassword] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [userData, setUserData] = useState([]);

    const handleLogin = async () => {
        const result = await axios({
            method: "POST",
            url: `http://127.0.0.1:5000/api/auth`,
            data: {
                "email": email,
                "pass": password 
            },
            // withCredentials: true,
            crossDomain: true,
            headers: {
                "Bypass-Tunnel-Reminder": "*",
            }
        }).catch((error) => {
            console.log("In axios", error.response);
            throw error;
        });

        setUserLoggedIn(result?.data?.success);
        setUserData(result?.data?.data);
    }

    return (
            userLoggedIn ? 
            <User userData={userData} />
            :
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                    component="form"
                    sx={{
                        my: 30,
                        mx: 4,
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off">
                        <center>
                        <Avatar sx={{ m: 1, bgcolor: 'black' }}>
                            <Face5Icon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        </center>
                        <center>
                            <TextField
                                label="Email"
                                name="email" 
                                value={email} 
                                onChange={event => setEmail(event.target.value)}
                                variant="standard"
                            />
                        </center>
                        <center>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                label="Password"
                                name="password" 
                                value={password} 
                                onChange={event => setPassword(event.target.value)}
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                    <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        </center>
                        <center style={{marginTop: '3rem'}}>
                            <Button variant="outlined" endIcon={<CelebrationIcon />} color="secondary" onClick={handleLogin}>Login</Button>
                        </center>
                    </Box>
                </Grid>
            </Grid> 
    )
}

export default Login;