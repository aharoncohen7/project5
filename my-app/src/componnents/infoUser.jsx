
import { useState, useEffect } from "react";
import Home from './home';



export default function Info({ userId, userName }) {
    const [user, setUser] = useState({})


  //בקשת GET מהשרת
  useEffect(() => {
    const fetchData = async () => {
        try {
            const urlUser = `http://localhost:3100/users/${userId}`;
            const response = await fetch(urlUser);
            const userData = await response.json();
            setUser(userData)
        } catch (error) {
            console.error("Error fetching userData", error);
        }
    };
    fetchData();
}, []);


    return (
     <>
      <Home userId={userId} userName={userName} />
     <h2>פרטי משתמש רשום</h2>
     <h1>{user.name}</h1>
     <h2>{user.email} אימייל</h2>
     <h2>{user.website} אתר הבית </h2>
     <h2>{user.phone} טלפון:</h2>
    
     
     
     
     
     </>

    )














}