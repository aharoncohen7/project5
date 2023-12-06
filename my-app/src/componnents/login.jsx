import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from '../style/style.module.css'


const Login = ({setUserID, setUserName}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  //פונקצית LOGIN
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3100/users');
      const users = await response.json();
      const user = users.find(u => u.username === username && u.website === password);

      if (user) {
        setError('Login successful');
        setUserID(user.id)
        setUserName(user.username)
        localStorage.setItem(user.username, JSON.stringify(user.website));
        navigate(`/home/${user.id}`)
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Error during login');
    }
  };

  return (
    <div className={style.login}>
      <h2>Login</h2>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};


export default Login;
