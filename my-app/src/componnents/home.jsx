
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../style/style.module.css'

export default function Home({ userId, userName }) {
  const navigate = useNavigate();
  
  // אבטחה
  useEffect(() => {
    const loggedInUser = localStorage.getItem(userName);
     if (!loggedInUser) {
       navigate('/');
       }
   }, []);


  return (
    <div  className={style.home}>
      <span >Hi {userName} <br/><div className='button' onClick={() => { navigate('/', { replace: true }) ;localStorage.removeItem(userName); }} style={{display:"block", marginTop: "0px", color:"pink"}}>
        Log-out
      </div> </span>
      <div className='button' onClick={() => { navigate(`/info/${userId}`) }}>
        Info
      </div>
      <div className='button' onClick={() => { navigate(`/todos/${userId}`) }}>
        Todos
      </div>
      <div  className='button' onClick={() => { navigate(`/albums/${userId}`) }}>
        Albums
      </div>
      <div className='button' onClick={() => { navigate(`/posts/${userId}`) }}>
        Posts
      </div>
      <div style={{ backgroundImage: `url("./logo.jpg")` }} id='logo' className='button' onClick={() => { navigate(`/home/${userId}`) }}>
        <img src="./logo.jpg" alt="Home" />
      </div>
      <br/>
      
    </div>
  );
}
