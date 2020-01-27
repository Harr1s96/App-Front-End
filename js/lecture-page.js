"use strict"

const menu = document.getElementById("menu");
menu.style.display = "none";

const updateButton = document.getElementById("update-button");
const deleteButton = document.getElementById("delete-button");

      
const lectureList = document.getElementById("lecture-list");
const listGroup = document.getElementById("list-group");
const mainDiv = document.getElementById("list-div");

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');
  
const lectureData = axios.get("http://3.11.133.109:9090/UniversalApp/teachers/modules/" + myParam)
    .then(response => {console.log(response.data); 
        return response.data;});

function postLectures() {

    let lectureName = document.getElementById("lecture").value;

    const toPost = [{"lectureName": lectureName}]

    axios.put("http://3.11.133.109:9090/UniversalApp/module/" + myParam, toPost)
        .then(response => {console.log(response); location.reload();})
}

function getLectures() {

    lectureData.then(data => {
        
        for (let lecture of data.lectures) {
            
            const listElement = document.createElement("li");
            listElement.className = "list-group-item list-group-item-action";
            listElement.innerHTML = lecture.lectureName;
            
            listElement.oncontextmenu = (function (event) {
                event.preventDefault();
                menu.style.display = "block";
                updateButton.value = lecture.id;
                deleteButton.value = lecture.id;
            });
            
            window.onclick = function(event) {
                if (event.target == menu) {
                    menu.style.display = "none";
                }
            }

            listGroup.appendChild(listElement);
        }
    });
}

function updateLecture(elementId) {

    const toUpdate = document.getElementById("update-lecture").value;
    const data = {"lectureName": toUpdate}
    axios.put("http://3.11.133.109:9090/UniversalApp/lecture?id=" + elementId, data)
        .then(response => {
            console.log(response);
            updateButton.value = ""; 
            location.reload();
        });
}

function deleteLecture(elementId) {

    axios.delete("http://3.11.133.109:9090/UniversalApp/lecture/" + elementId)
        .then(response => {
            console.log(response);
            deleteButton.value = "";
            location.reload();
        });
}
