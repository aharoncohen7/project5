import React from 'react';
import { useState, useEffect } from 'react';
import style from '../style/style.module.css'


const CommentList = ({ postId, showComments }) => {
  const urlComments = `http://localhost:3100/comments?postId=${postId}`;
  const [comments, setComments] = useState([]);
  const [counter, setCounter] = useState(1)
 

// קבלת הערות לפוסט
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlComments);
        const data = await response.json();
        setComments(data)
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchData();
  }, [counter]);

  //הוספת הערה לתצוגה
  function addComment() {
    setCounter((prev) => {
      if (prev === 5) {
        alert("no more comments");
        return prev;
      }
      return prev + 1;
    });
  }

  return (
    <ul style={showComments ? { display: "block" } : { display: "none" }}>
       <button onClick={addComment}> הוסף תגובה</button>

      {comments.slice(0, counter).map((comment) => (
       
          <div style={style.comments}>
            <h3>{comment.id}</h3>
            <p>{comment.name}</p>
            <p>{comment.email}</p>
            <pre>{comment.body}</pre>
          </div>
      ))}


    </ul>

  );
};

export default CommentList;