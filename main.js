const serverIP = "http://localhost:25532";

const courseSelect = document.getElementById("courseSelect");
let courses = null;

async function onLoad() {
    let _coursesRaw = await getAPI("course");
    courses = JSON.parse(_coursesRaw);

    for(let i = 0; i < 96; i++)
        courseSelect.appendChild(new Option(courses[i].name))
};

async function onSelectionChange() {
    await getAPI("course?identifier=" + courseSelect.nodeValue);
}

async function getAPI(_request) {
    const url = serverIP + "/api/" + _request;
    const response = await fetch(url);

    return await response.text();
}