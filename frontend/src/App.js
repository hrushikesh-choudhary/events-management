import logo from './logo.svg';
import './App.css';
import Login from './Containers/Login/Login.component';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    document.title = 'Event Booking and Purchase Management System';
  },[])

  return (
    <Login />
  );
}

export default App;
