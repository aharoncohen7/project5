import React, { useState, useEffect } from "react";
import Module_compo from "./module_compo"
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import style from '../style/style.module.css'
import Home from './home';

function Todos({ userId, userName }) {
    //סטייטים
    const [titleFormInput, setTitleFormInput] = useState('');
    const [selectedOption, setSelectedOption] = useState(true);
    const [filter, setFilter] = useState('random');
    const [change, setChange] = useState(true);
    const [dataFilter, setDataFilter] = useState([]);
    const [dataFilter2, setDataFilter2] = useState([]);
    const [myTodos, setMyTodos] = useState([]);
    const [id, setId] = useState("");
    const navigate = useNavigate();
    const page = "todos"

    //פונקציות
    //    פונקציית אבטחה
    useEffect(() => {
        const loggedInUser = localStorage.getItem(userName);
        if (!loggedInUser) {
            navigate('/');
        }
    }, []);

    //גט טודוס
    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlTodos = "http://localhost:3100/todos";
                const response = await fetch(urlTodos);
                const data = await response.json();
                const dataById = data.filter((elm) => elm.userId === parseInt(userId));
                setDataFilter(dataById);
                setDataFilter2(dataById);
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };
        fetchData();
    }, [userId, change]);

    // הוספת חדש
    async function addNewTodo() {
        const result = await Swal.fire({
            title: 'כתוב משימה חדשה',
            html: '<textarea id="title"  style=" background-color: rgba(172, 192, 389, 0.74); width: 350px; text-align: center;" class="swal2-input" placeholder="כותרת">',
            showCancelButton: true,
            confirmButtonText: 'אישור',
            cancelButtonText: 'ביטול',
            preConfirm: () => {
                const title = document.getElementById('title').value;
                if (!title) {
                    Swal.showValidationMessage('אנא מלא את כל השדות');
                }
                return { title };
            }
        });

        if (result.value) {
            const { title } = result.value;
            await fetch('http://localhost:3100/todos', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    userId,
                    completed: false,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            console.log('Todo created successfully');
            setChange(!change);
        }
    }

    //כפתורי עריכה 
    async function buttonEvent(event, item) {
        switch (event.target.value) {
            case 'delete':
                await fetch(`http://localhost:3100/todos/${item.id}`, {
                    method: 'DELETE',
                });
                setChange(!change);
                return;

            case 'edit':
                const oldTitle = item.title;
                const result = await Swal.fire({
                    title: 'ערוך הודעתך',
                    html: '<textarea id="title"  style=" background-color: rgba(172, 192, 389, 0.74); width: 350px; text-align: center;" class="swal2-input" placeholder="כותרת">' + oldTitle + '</textarea>',
                    showCancelButton: true,
                    confirmButtonText: 'אישור',
                    cancelButtonText: 'ביטול',
                    // inputValue: oldTitle + " ",
                    preConfirm: () => {
                        const title = document.getElementById('title').value;
                        if (!title) {
                            Swal.showValidationMessage('אנא מלא את כל השדות');
                        }
                        return title;
                    }
                });

                if (!result.value) { return }
                const newTitle = result.value;
                await fetch(`http://localhost:3100/todos/${item.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        title: newTitle,
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
                // .then((response) => response.json())
                // .then((json) => console.log(json));
                setChange(!change);
                return;
            case 'completed':
                await fetch(`http://localhost:3100/todos/${item.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        completed: true,
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
                alert("המשימה הושלמה")
                setChange(!change);
                return;
            case 'notCompleted':
                await fetch(`http://localhost:3100/todos/${item.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        completed: false,
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
                alert("המשימה לא הושלמה")
                setChange(!change);
                return;
            default:
                return;
        }

    }

    // תצוגה
    //   בורר סוג מיון
    const handleOptionChange = (event) => {
        document.getElementById("input1").value = "";
        document.getElementById("input2").value = "";
        setSelectedOption(event.target.value === "true");
        setDataFilter2(dataFilter);
    };
    //בורר סוג פילטר
    function handleFilterChange(e) {
        setFilter(e.target.value);
    };

    //בורר סוג מיון
    const filterTodos = (dataFilter, filter) => {
        switch (filter) {
            case 'sequential':
                return dataFilter;
            case 'completed':
                return dataFilter.filter((todo) => todo.completed);
            case 'unCompleted':
                return dataFilter.filter((todo) => !todo.completed);
            case 'alphabetical':
                return [...dataFilter].sort((a, b) => a.title.localeCompare(b.title));
            case 'random':
                return [...dataFilter].sort(() => Math.random() - 0.5);
            default:
                return dataFilter;
        }
    };

    // סינון לפי טקטס כותרת
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

    //פונקציית המיון
    useEffect(() => {
        const sort_todos = () => {
            const filteredTodos = filterTodos(dataFilter2, filter);
            setMyTodos(filteredTodos);
        };
        if (dataFilter !== '') {
            sort_todos();
        }
    }, [dataFilter2, filter])


    return (
        <div className={style.todos}>
            <Home userId={userId} userName={userName} />

            <div className={style.filters}>
                <h1 className="titles">Todos</h1>
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
                /> Search by Title</span><br/>

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
                        <option value="unCompleted">Not completed</option>
                        <option value="completed">Completed</option>
                    </select>

                </div>
                <br />
                <span> Add new todo </span><button onClick={addNewTodo}> ➕</button>
            </div>

            {myTodos.map((item) => (
                <Module_compo
                    item={item}
                    buttonEvent={buttonEvent}
                    owner={item.userId === userId}
                    page={page}
                />
            ))}

        </div>
    );
}

export default Todos;
