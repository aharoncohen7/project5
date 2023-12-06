import React, { useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Todos from "./componnents/todos";
import Posts from './componnents/posts';
import Albums from './componnents/albums';
import Login from './componnents/login';
import Home from './componnents/home';
import Info from './componnents/infoUser';


function App() {
  const [userId, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login setUserName={(userName) => setUserName(userName)} setUserID={(userId) => setUserID(userId)}  />} />
          <Route path="home/:id" element={<Home userId={userId} userName={userName} /> } />
          <Route path="todos/:id" element={<Todos userId={userId} userName={userName}/> } />
          <Route path="posts/:id" element={<Posts userId={userId} userName={userName}/>} />
          <Route path="albums/:id" element={<Albums userId={userId} userName={userName}/>} />
          <Route path="info/:id" element={<Info userId={userId} userName={userName}/>} />
          <Route path="/*" element={<h1>404</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;