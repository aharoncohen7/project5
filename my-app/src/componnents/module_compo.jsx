
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import style from '../style/style.module.css'
import CommentList from './commentsList';



function Module_compo({ item, buttonEvent, page, owner, src }) {
    console.log(owner);
    const [change, setChange] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const url = `http://localhost:3100/${page}?userId=${item.userId}&id=${item.id}`;

     //תצוגה
     const toggleComments = () => {
        setShowComments(!showComments);
      };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setData(data[0])
                console.log(data[0]);
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };
        fetchData();
    }, [change]);


    

    return (

        <div key={item.id} className={style.moduel_compo} style={owner?{}:{backgroundColor: "rgba(11, 215, 230, 0.438)"}}>
            
            <h2>{`${page.slice(0, -1)}: ${item.id}`}</h2>
            <h2>{item.title}</h2>
            <div 
            className={`${style.post} ${expanded ? style.expanded : ''}`}
            style={expanded?{display: "block"} : {display: "none"}}
            >{item.body ? item.body : ''}</div>
            <div className="EditButtons" style={owner?{display:"block" }:{display: "none", backgroundColor: "yellow"}}>
                <input
                    style={page==="todos"?{display:"inline-block"}:{display:"none"}}
                    type="checkbox"
                    id="checkbox"
                    name="scales"
                    value="completed"
                    checked={item.completed}
                    onChange={(event) => buttonEvent(event, item)}
                />
                <input
                    style={page==="todos"?{display:"inline-block"}:{display:"none"}}
                    type="checkbox"
                    id="checkboxTrue"
                    name="scales"
                    value="notCompleted"
                    checked={!item.completed}
                    onChange={(event) => buttonEvent(event, item)}
                />
                <label>
                    <button value="delete" onClick={(event) => buttonEvent(event, item)}>🗑️</button>
                    <button value="edit" onClick={(event) => buttonEvent(event, item)}>✏️</button>
                    {/* <button value="up_date" onClick={(event) => buttonEvent(event, item)}>upDate</button> */}
                </label>
            </div>

            <p  style={page==="photos"?{display: "inline-block"}:{display: "none"}}><img src={src} style={{ width: "50%", height: "auto" }} /></p>

            <div  style={page==="posts"?{display: "block"}:{display: "none"}}>
            <button style={expanded? {display: "inline-block"}:{display: "none"}} onClick={toggleComments}> {showComments? 'הסתר תגובות' : 'הצג תגובות'}</button>
            <button  onClick={()=>setExpanded(!expanded)}> {page.slice(0, -1)} {expanded? 'הסתר תוכן' : 'הצג תוכן'}</button>
            <CommentList postId={item.id} showComments={showComments}/>
            </div>
            
        </div>
    )
}

export default Module_compo;

