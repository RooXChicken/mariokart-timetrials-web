const serverIP = "http://10.0.0.51:25532";
let courses = null;
let records = null;
let selectedCourse = null;

const courseSelect = document.getElementById("courseSelect");
const courseIcon = document.getElementById("courseIcon");
const recordDiv = document.getElementById("records");

const playerName = document.getElementById("playerName");
const playerTime = document.getElementById("playerTime");
const playerScreenshot = document.getElementById("playerScreenshot");

async function onLoad() {
    let _coursesRaw = await apiRequest("course");
    courses = JSON.parse(_coursesRaw);

    for(let i = 0; i < 96; i++)
        courseSelect.appendChild(new Option(courses[i].name, courses[i].identifier))

    selectedCourse = courses[0];
    getCourseRecords();
};

async function onSelectionChange() {
    let _courseRaw = await apiRequest("course?identifier=" + courseSelect.options[courseSelect.selectedIndex].value);
    selectedCourse = JSON.parse(_courseRaw)[0];

    courseIcon.src = "assets/icons/" + selectedCourse.identifier + ".png";
    getCourseRecords();
}

async function apiRequest(_request) {
    const url = serverIP + "/api/" + _request;
    const response = await fetch(url);

    return await response.text();
}

async function submitTime() {
    let _name = playerName.value;
    let _time = playerTime.value;
    const _file = playerScreenshot.files[0];
    
    if(_file.size > 8000000)
    {
        window.alert("This file is too large! (8mb+)")
        return;
    }
        
    let _imageUrl = hashString(_name + _time);
    let _reader = new FileReader();
    
    _reader.addEventListener("load", async function () {
        let _request = new XMLHttpRequest();
        _request.open("POST", serverIP + "/api/submit?name=" + _name + "?time=" + _time + "?img=" + _imageUrl + "?course=" + selectedCourse.id, true);
        _request.setRequestHeader('Content-Type', "text/plain");
        _request.send(arrayBufferToBase64(this.result));
    });
    
    _reader.readAsArrayBuffer(_file);

    setTimeout(() => {
        getCourseRecords();
    }, 1000);
}

async function getCourseRecords() {
    let _coursesRaw = await apiRequest("record?course_id=" + selectedCourse.id);
    records = JSON.parse(_coursesRaw);

    while(recordDiv.rows.length > 1) {
        recordDiv.deleteRow(1);
    }

    for(let i = 0; i < records.length; i++) {
        let _row = recordDiv.insertRow();
        _row.class = "courseRecord";

        var _name = _row.insertCell(0);
        var _time = _row.insertCell(1);
        var _proof = _row.insertCell(2);

        _name.innerHTML = "<p>" + records[i].name + "</p>";
        _time.innerHTML = "<p>" + records[i].time + "</p>";
        _proof.innerHTML = "<img class=\"courseProof\" src=\"" + records[i].image_url + "\">";
    }
}

// thank you!!!
// https://stackoverflow.com/a/52171480
const hashString = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// thank you!!
// https://stackoverflow.com/a/9458996
function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}