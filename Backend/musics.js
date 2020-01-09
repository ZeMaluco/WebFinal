// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDXCHktP8LthadJ7t2ihelQk-uE5FuGLHE",
    authDomain: "nmixer-97a91.firebaseapp.com",
    databaseURL: "https://nmixer-97a91.firebaseio.com",
    projectId: "nmixer-97a91",
    storageBucket: "nmixer-97a91.appspot.com",
    messagingSenderId: "442632908091",
    appId: "1:442632908091:web:7bd8b657d775ecd63b9b1e",
    measurementId: "G-ERHC4YKRDH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var usersRef = firebase.database().ref().child('Users');
var users = [];

usersRef.on('value', snap => {
    users = snap.val();
});

//Shareds
const sharesRef = firebase.database().ref().child('Shares');
var shares = [];

sharesRef.on('value', snap => {
    shares = snap.val();
});


//Musics
var tableMusics = document.querySelector('#tableMusics tbody');
const musicsRef = firebase.database().ref().child('Musics');
var musics = [];
var searchMusic = document.getElementById("searchMusic");

musicsRef.on('value', snap => {
    musics = snap.val();

    refreshTableMusics(musics);
});


var value = "";

searchMusic.addEventListener("keyup", function(event) {
    value = searchMusic.value;
    var newMusics = [];
    var alreadyFound = false;

    for (var i in musics) {
        if (musics[i]["id"].toLowerCase().includes(value.toLowerCase()) || musics[i]["title"].toLowerCase().includes(value.toLowerCase()) || musics[i]["time"].toLowerCase().includes(value.toLowerCase()) || musics[i]["date"].toLowerCase().includes(value.toLowerCase()) || musics[i]["idUser"].toLowerCase().includes(value.toLowerCase())) {
            newMusics.push(musics[i]);
            alreadyFound = true;
        }
    }

    if (!alreadyFound) {
        for (var i in users) {
            if (users[i]["name"].toLowerCase().includes(value.toLowerCase())) {
                for (var j in musics) {
                    if (users[i]["id"] == musics[j]["idUser"]) {
                        newMusics.push(musics[j]);
                    }
                }
            }

        }
    }

    refreshTableMusics(newMusics);
});

function refreshTableMusics(musics) {
    while (tableMusics.hasChildNodes()) {
        tableMusics.removeChild(tableMusics.firstChild);
    }

    for (var i in musics) {
        row = tableMusics.insertRow(-1);

        cell = row.insertCell(-1);
        cell.innerHTML = musics[i]["id"];

        cell = row.insertCell(-1);
        cell.innerHTML = musics[i]["title"];

        cell = row.insertCell(-1);
        cell.innerHTML = musics[i]["time"];

        cell = row.insertCell(-1);
        cell.innerHTML = musics[i]["date"];

        for (var j in users) {
            if (musics[i]["idUser"] == users[j]["id"]) {
                cell = row.insertCell(-1);
                cell.innerHTML = users[j]["name"];
            }
        }

        for (var j in shares) {
            if (musics[i]["id"] == shares[j]["idMusic"]) {
                cell = row.insertCell(-1);
                var audio = document.createElement("AUDIO");
                audio.setAttribute("src", shares[j]["link"]);
                audio.setAttribute("controls", "controls");
                cell.appendChild(audio);
            }
        }
    }
}