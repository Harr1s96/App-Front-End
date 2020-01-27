"use strict";

const teacherMenu = document.getElementById("teacher-menu");
teacherMenu.style.display = "none";

const teacherUpdateButton = document.getElementById("teacher-update-button");
const teacherDeleteButton = document.getElementById("teacher-delete-button");

const teacherList = document.getElementById("teacher-list");
const listGroup = document.getElementById("list-group");
const mainDiv = document.getElementById("list-div");

const teacherData = axios.get("/UniversalApp/teachers")
    .then(response => {console.log(response.data); 
                    return response.data;});

function postTeacher() {

    let str = document.getElementById("lecturer").value;
    let lecturerNameArray = str.split(" ");
    
    let moduleName = document.getElementById("moduleName").value;
    let moduleCode = document.getElementById("moduleCode").value;

    const toPost = {
        "firstName":lecturerNameArray[0],
        "lastName":lecturerNameArray[1],
        "modules":[{"moduleName": moduleName, "moduleCode": moduleCode}]}

    axios.post("/UniversalApp/teacher", toPost)
        .then(response => {console.log(response); 
            location.reload();
        })
        .catch(error => {
            if (error.response.status === 400) {
                alert("Please Enter a CHEM XXX Module");
                location.reload();
            }
        });
}

function getTeachers() {

    teacherData.then(data => {
        for (let teacher of data) {
            
            const listElement = document.createElement("li");
            listElement.className = "list-group-item list-group-item-action";
            listElement.innerHTML = teacher.firstName + " " + teacher.lastName;
            
            listElement.onclick = (function() {
                let clickedElement = document.querySelector(".active");
                
                if (clickedElement) {
                    clickedElement.classList.remove("active");
                }
                
                this.classList.add("active");
                getModules(this.innerHTML);
            });
            
            listElement.oncontextmenu = (function (event) {
                event.preventDefault();
                teacherMenu.style.display = "block";
                teacherUpdateButton.value = teacher.id;
                teacherDeleteButton.value = teacher.id;
            });
            
            window.onclick = function(event) {
                if (event.target == teacherMenu) {
                    teacherMenu.style.display = "none";
                }
            }
        
            listGroup.appendChild(listElement);
        }
    });
}

function getModules(listText) {

    mainDiv.innerHTML = "";

    const dropList = document.createElement("select");
    dropList.name = "dropdown";
    dropList.id = "dropdown";
    dropList.onchange = (function() {window.location.href=this.value});

    const dropListTitle = document.createElement("option");
    dropListTitle.value = "none";
    dropListTitle.setAttribute("selected", "");
    dropListTitle.setAttribute("hidden", "");
    dropListTitle.text = "Please select a module";

    mainDiv.appendChild(dropList);
    dropList.appendChild(dropListTitle); 

    let listElems = document.getElementById("list-group").getElementsByTagName("li");

    for (let i = 0; i < listElems.length; i++) {    
        teacherData.then(data => {
            if ((data[i].firstName + " " + data[i].lastName) === listText) {
                for (let m of data[i].modules) {  
                    const optionElement = document.createElement("option");
                    optionElement.value = "lecture-page.html?id=" + m.id;
                    optionElement.className = "options";  
                    optionElement.text = m.moduleCode + " " + m.moduleName;
                    dropList.appendChild(optionElement);
                }
            }
        });
    }
}

function updateTeacher(elementId) {

    const addedModuleCode = document.getElementById("update-module-code").value;
    const addedModuleName = document.getElementById("update-module-name").value;
    const toUpdate = document.getElementById("update-teacher").value;
    
    let lecturerNameArray = toUpdate.split(" ");
    const data = {"firstName": lecturerNameArray[0], "lastName": lecturerNameArray[1]}

    axios.all([
        axios.put("/UniversalApp/teacher?id=" + elementId, data),
        axios.put("/UniversalApp/teacher/" + elementId,
            [{"moduleCode": addedModuleCode, "moduleName": addedModuleName}])
    ])
    .then(responseArr => {
        console.log(responseArr);
        teacherUpdateButton.value = "";
        location.reload();
    });
    
}

function deleteTeacher(elementId) {

    axios.delete("/UniversalApp/teacher/" + elementId)
        .then(response => {
            console.log(response);
            teacherDeleteButton.value = "";
            location.reload();
        });
}
