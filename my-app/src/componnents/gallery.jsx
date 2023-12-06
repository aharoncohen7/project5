
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import Module_compo from "./module_compo"

export default function Gallery({ album, albumId, SelectAlbum, albumToShow }) {
    let page = "photos";
    const [myPhotos, setMyPhotos] = useState([]);
    const [change, setChange] = useState(true);
    const [counter, setCounter] = useState(1);

    //בקשת גט על תמונות האלבום
    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlPhotos = `http://localhost:3100/albums/${albumId}/photos`;
                const response = await fetch(urlPhotos);
                const data = await response.json();
                setMyPhotos(data);
            } catch (error) {
                console.error("Error fetching photos:", error);
            }
        };
        fetchData();
    }, [change]);

    //    כפתורי עריכה 
    async function buttonEvent(event, item) {
        switch (event.target.value) {
            case 'delete':
                await fetch(`http://localhost:3100/photos/${item.id}`, {
                    method: 'DELETE',
                });
                setChange(!change);
                return;

            case 'edit':
                const result = await Swal.fire({
                    title: 'ערוך תמונה',
                    html: '<textarea id="title" style="background-color: rgba(172, 192, 389, 0.74); width: 350px; text-align: center;" class="swal2-input" placeholder=" כותרת תמונה"></textarea>' +
                        '<textarea id="url" style="height: 100px; background-color: rgba(172, 592, 189, 0.74); width: 300px; text-align: center;" class="swal2-input" placeholder="קישור"></textarea>',
                    showCancelButton: true,
                    confirmButtonText: 'אישור',
                    cancelButtonText: 'ביטול',
                    preConfirm: () => {

                        const title = document.getElementById('title').value;
                        const url = document.getElementById('url').value;
                        if (!title || !url) {
                            Swal.showValidationMessage('אנא מלא את כל השדות');
                        }
                        return { title, url };
                    }
                });
                if (!result.value) { return }
                alert(result.value.title);
                await fetch(`http://localhost:3100/photos/${item.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        title: result.value.title,
                        url: result.value.url
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

    // טעינת תמונות
    function uploadPhotos() {
        setCounter((prev) => {
            if (prev === 10) {
                alert("no more Photos to upload");
                return prev;
            }
            return prev + 1;
        });
    }






    return (
        <p>
            <button style={album.id !== albumToShow ? { display: "block", width: "100%" } : { display: "none" }} onClick={() => SelectAlbum(albumId)}>Show photos</button>
            <button style={album.id === albumToShow ? { display: "block", width: "100%" } : { display: "none" }} onClick={() => { SelectAlbum(0); setCounter(1) }}>Close photos</button>
            <br />
            <br />

            {myPhotos.slice(0, counter * 5).map((item) => (
                <div key={item.id} style={album.id === albumToShow ? { display: "inline-block" } : { display: "none" }} >
                    <Module_compo
                        item={item}
                        owner={true}
                        buttonEvent={buttonEvent}
                        page={page}
                        src={item.url}
                    />

                </div>

            ))}
            <button style={album.id === albumToShow ? { display: "block", width: "100%" } : { display: "none" }} onClick={() => uploadPhotos()}>upload more</button>
        </p>
    );
}