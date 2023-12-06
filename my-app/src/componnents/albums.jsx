import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import style from '../style/style.module.css'
import Gallery from './gallery';
import Home from './home';

export default function Albums({ userId, userName }) {
    //סטייטים
    const [titleFormInput, setTitleFormInput] = useState('');
    const [selectedOption, setSelectedOption] = useState(true);
    const [filter, setFilter] = useState('alphabetical');
    const [change, setChange] = useState(true);
    const [dataFilter, setDataFilter] = useState([]);
    const [dataFilter2, setDataFilter2] = useState([]);
    const [myAlbums, setMyAlbums] = useState([]);
    const [id, setId] = useState("");
    const navigate = useNavigate();
    const [albumToShow, setAlbumToShow] = useState(0)
    const page = "albums"


    // אבטחה
    useEffect(() => {
        const loggedInUser = localStorage.getItem(userName);
        if (!loggedInUser) {
            navigate('/');
        }
    }, []);

    //בקשת GET מהשרת
    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlAlbums = `http://localhost:3100/users/${userId}/albums`;
                const response = await fetch(urlAlbums);
                const data = await response.json();
                console.log(data);
                // const dataById = data.filter((elm) => elm.userId === parseInt(userId));
                setDataFilter(data);
                setDataFilter2(data);
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };
        fetchData();
    }, [userId, change]);
    //חיפוש לפי אותיות
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


    //אלבום חדש
    async function addNewAlbum() {
        const result = await Swal.fire({
            title: 'כותרת לאלבום',
            html: '<textarea id="title"  style=" background-color: rgba(172, 192, 389, 0.74); width: 350px; text-align: center;" class="swal2-input" placeholder="כותרת">',
            showCancelButton: true,
            confirmButtonText: 'אישור',
            cancelButtonText: 'ביטול',
            preConfirm: () => {
                const title = document.getElementById('title').value;
                if (!title) {
                    Swal.showValidationMessage('נא הכנס כותרת');
                }
                return { title };
            }
        });

        if (result.value) {
            const { title } = result.value;
            await fetch('http://localhost:3100/albums', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    userId,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            console.log('Album created successfully');
            setChange(!change);
        }
    }

    //בורר חיפושים
    const handleOptionChange = (event) => {
        document.getElementById("input1").value = "";
        document.getElementById("input2").value = "";
        setSelectedOption(event.target.value === "true");
        setDataFilter2(dataFilter);
    };
    //בורר מיונים
    const filterAlbums = (dataFilter, filter) => {
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
    //בורר סוג פילטר
    function handleFilterChange(e) {
        setFilter(e.target.value);
    };
    //חיפוש לפי ID
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

    //מיון בפועל
    useEffect(() => {
        const sort_albums = () => {
            const filteredAlbums = filterAlbums(dataFilter2, filter);
            setMyAlbums(filteredAlbums);
        };
        if (dataFilter !== '') {
            sort_albums();
        }
    }, [dataFilter2, filter])

    // בחירת אלבום להצגה
    function setAlbumToShow2(id) {
        setAlbumToShow(id)
    }


    return (
        <div className={style.albums}>
            <Home userId={userId} userName={userName} />

            {/* מתחם תצוגה סינון ומיון */}
            <div className={style.filters}>
                <h1>Albums</h1>
                <span><input
                    type="radio"
                    name="options"
                    value="false"
                    checked={selectedOption === false}
                    onChange={handleOptionChange}
                /> Search by ID </span>

                
                <span><input
                    type="radio"
                    name="options"
                    value="true"
                    checked={selectedOption === true}
                    onChange={handleOptionChange}
                /> Search by Title</span>
                <br />

                <input
                    style={selectedOption ? { display: "none" } : { display: "inline" }}
                    id="input1"
                    type="text"
                    onChange={(event) => setId(event.target.value)}
                    placeholder={`Enter ID (${(userId - 1) * 10 + 1}-${userId * 10})`}
                />


                <input
                    style={!selectedOption ? { display: "none" } : { display: "inline" }}
                    id="input2"
                    className='eee'
                    type="text"
                    onChange={(event) => setTitleFormInput(event.target.value)}
                    placeholder="Enter titel"
                />

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
             <span>Add new album</span>   <button onClick={addNewAlbum}>   ➕</button>
            </div>


            {myAlbums.map((album) => (
                <div className={style.album} style={{ backgroundColor: "pink" }}>
                    <h2>אלבום {album.id}</h2>
                    <h2>{album.title}</h2>
                    <h3>{userName} :משתמש </h3>
                    <h3>{ }</h3>
                    <Gallery album={album} SelectAlbum={setAlbumToShow2} albumToShow={albumToShow} albumId={album.id} />
                </div>
            ))}

        </div>
    );
}



