import { useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Module_compo from "./module_compo"
import Swal from 'sweetalert2';
import style from '../style/style.module.css'
import Home from './home';


export default function Posts({ userId, userName }) {
    //סטייטים
    const [titleFormInput, setTitleFormInput] = useState('');
    const [selectedOption, setSelectedOption] = useState(true);
    const [filter, setFilter] = useState('alphabetical');
    const [change, setChange] = useState(true);
    const [dataFilter, setDataFilter] = useState([]);
    const [dataFilter2, setDataFilter2] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [id, setId] = useState("");
    const navigate = useNavigate();
    const page = "posts"

    //פונקציות
    // פונקציית אבטחה
    useEffect(() => {
        const loggedInUser = localStorage.getItem(userName);
        if (!loggedInUser) {
            navigate('/');
        }
    }, []);

    // קבלת פוסטים
    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlPosts = "http://localhost:3100/posts";
                const response = await fetch(urlPosts);
                const data = await response.json();
                // const dataById = data.filter((elm) => elm.userId === parseInt(userId));
                setDataFilter(data);
                setDataFilter2(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchData();
    }, [userId, change]);

    //פוסט חדש
    async function addNewPost() {
        const result = await Swal.fire({
            title: 'כתוב פוסט חדש',
            html: '<textarea id="title" style="background-color: rgba(172, 192, 389, 0.74); width: 350px; text-align: center;" class="swal2-input" placeholder="כותרת"></textarea>' +
                '<textarea id="body" style="height: 300px; background-color: rgba(172, 592, 189, 0.74); width: 350px; text-align: center;" class="swal2-input" placeholder="גוף הפוסט"></textarea>',
            showCancelButton: true,
            confirmButtonText: 'אישור',
            cancelButtonText: 'ביטול',
            preConfirm: () => {
                const title = document.getElementById('title').value;
                const body = document.getElementById('body').value;
                if (!title || !body) {
                    Swal.showValidationMessage('אנא מלא את כל השדות');
                }
                return { title, body };
            }
        });

        if (result.value) {
            const { title, body } = result.value;

            await fetch('http://localhost:3100/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    body,
                    userId,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            setChange(!change);
        }
    }

    //כפתורי עריכה 
    async function buttonEvent(event, item) {
        switch (event.target.value) {
            case 'delete':
                alert(`post ${item.id} deleted`)
                fetch(`http://localhost:3100/posts/${item.id}`, {
                    method: 'DELETE',
                });
                setChange(!change);
                return;

            case 'edit':
                const oldTitle = item.title;
                const oldBody = item.body;
                const result = await Swal.fire({
                    title: 'ערוך פוסט',
                    html: '<textarea id="title" style="background-color: rgba(172, 192, 389, 0.74); width: 350px; text-align: center;" class="swal2-input" placeholder="כותרת">' + oldTitle + '</textarea>' +
                        '<textarea id="body" style="height: 300px; background-color: rgba(172, 592, 189, 0.74); width: 350px; text-align: center;" class="swal2-input" placeholder="גוף הפוסט">' + oldBody + '</textarea>',
                    showCancelButton: true,
                    confirmButtonText: 'אישור',
                    cancelButtonText: 'ביטול',
                    preConfirm: () => {

                        const title = document.getElementById('title').value;
                        const body = document.getElementById('body').value;
                        if (!title || !body) {
                            Swal.showValidationMessage('אנא מלא את כל השדות');
                        }
                        return { title, body };
                    }
                });
                if (!result.value) { return }
                await fetch(`http://localhost:3100/posts/${item.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        title: result.value.title,
                        body: result.value.body
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })

                setChange(!change);
                return;
            default:
                return;
        }

    }

    // בורר סוג חיפוש
    const handleOptionChange = (event) => {
        document.getElementById("input1").value = "";
        document.getElementById("input2").value = "";
        setSelectedOption(event.target.value === "true");
        setDataFilter2(dataFilter);
    };

    //בורר מיון
    const filterPosts = (dataFilter, filter) => {
        switch (filter) {
            case 'sequential':
                return dataFilter;
            case 'alphabetical':
                return [...dataFilter].sort((a, b) => a.title.localeCompare(b.title));
            case 'random':
                return [...dataFilter].sort(() => Math.random() - 0.5);
            default:
                return dataFilter;
        }
    };

    // קובע סוג מסנן
    function handleFilterChange(e) {
        setFilter(e.target.value);
    };

    //  סינון לפי כותרת
    useEffect(() => {
        const fetchData = () => {
            const data_byTitle = dataFilter.filter((elm) => elm.title.includes(titleFormInput));
            setDataFilter2(data_byTitle);
        };
        if (titleFormInput !== '') {
            fetchData();
        }
        else {
            setDataFilter2(dataFilter)
        }
    }, [titleFormInput]);


    // סינון לפי מזהה
    useEffect(() => {
        const fetchData = () => {
            const data_by_id = dataFilter.filter((elm) => elm.id === parseInt(id));
            setDataFilter2(data_by_id);
        };
        if (id !== "") {
            fetchData();
        }
        else {
            setDataFilter2(dataFilter)
        }
    }, [id]);

    // המיון בפועל
    useEffect(() => {
        const sort_posts = () => {
            const filteredPosts = filterPosts(dataFilter2, filter);
            setMyPosts(filteredPosts);

        };
        if (dataFilter !== '') {
            sort_posts();
        }
    }, [dataFilter2, filter])



    return (
        <div className={style.posts}>
            <Home userId={userId} userName={userName} />


            {/* צתחם תצוגה סינון ומיון */}
            <div className={style.filters}>
                <h1>Posts</h1>
            
                <span><input
                    type="radio"
                    name="options"
                    value="false"
                    checked={selectedOption === false}
                    onChange={handleOptionChange}
                />  Search by ID  </span>
                
                
                <span><input
                    type="radio"
                    name="options"
                    value="true"
                    checked={selectedOption === true}
                    onChange={handleOptionChange}
                />  Search by Title</span>

                <div><input
                    style={selectedOption ? { display: "none" } : { display: "inline" }}
                    id="input1"
                    type="text"
                    onChange={(event) => setId(event.target.value)}
                    placeholder={`Enter ID (${(userId - 1) * 10 + 1}-${userId * 10})`}
                /></div>


                <div><input
                    style={!selectedOption ? { display: "none" } : { display: "inline" }}
                    id="input2"
                    className='eee'
                    type="text"
                    onChange={(event) => setTitleFormInput(event.target.value)}
                    placeholder="Enter titel"
                /></div>

                <div >
                    <p>Selected option:{selectedOption}</p>
                    <label htmlFor="filter">Filter by :    </label>
                    <select id="filter" onChange={handleFilterChange} value={filter}>
                        <option value="sequential">Sequential</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="random">Random</option>
                    </select>

                </div>
                <br />
                <span>Add new post</span> <button onClick={addNewPost}> ➕</button>
            </div>

            {myPosts.map((item) => (
                <>
                    <Module_compo
                        item={item}
                        owner={item.userId === userId}
                        buttonEvent={buttonEvent}
                        page={page}

                    />

                </>
            ))}

        </div>
    );
}

