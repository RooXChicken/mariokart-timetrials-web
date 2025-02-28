const serverIP = "http://localhost:25532";
let courses = null;
let selectedCourse = null;

const courseSelect = document.getElementById("courseSelect");
const courseIcon = document.getElementById("courseIcon");

async function onLoad() {
    let _coursesRaw = await getAPI("course");
    courses = JSON.parse(_coursesRaw);

    for(let i = 0; i < 96; i++)
        courseSelect.appendChild(new Option(courses[i].name, courses[i].identifier))
};

async function onSelectionChange() {
    let _courseRaw = await getAPI("course?identifier=" + courseSelect.options[courseSelect.selectedIndex].value);
    selectedCourse = JSON.parse(_courseRaw)[0];

    courseIcon.src = "assets/icons/" + selectedCourse.identifier + ".png";
}

async function getAPI(_request) {
    const url = serverIP + "/api/" + _request;
    const response = await fetch(url);

    return await response.text();
}