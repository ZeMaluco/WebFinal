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


//Users
var tableUsers = document.querySelector('#tableUsers tbody');
var usersRef = firebase.database().ref().child('Users');
var users = [];
var searchUser = document.getElementById("searchUser");

usersRef.on('value', snap => {
    users = snap.val();

    refreshTableUsers(users);
});

var value = "";

searchUser.addEventListener("keyup", function(event) {
    value = searchUser.value;
    var newUsers = [];

    for (var i in users) {
        if (users[i]["id"].toLowerCase().includes(value.toLowerCase()) || users[i]["name"].toLowerCase().includes(value.toLowerCase()) || users[i]["email"].toLowerCase().includes(value.toLowerCase())) {
            newUsers.push(users[i]);
        }
    }

    refreshTableUsers(newUsers);
});

function refreshTableUsers(users) {
    while (tableUsers.hasChildNodes()) {
        tableUsers.removeChild(tableUsers.firstChild);
    }

    for (var i in users) {
        row = tableUsers.insertRow(-1);

        cell = row.insertCell(-1);
        cell.innerHTML = users[i]["name"];

        cell = row.insertCell(-1);
        cell.innerHTML = users[i]["email"];

        cell = row.insertCell(-1);
        cell.innerHTML = users[i]["imageUrl"];
    }
}

//Shareds
const sharesRef = firebase.database().ref().child('Shares');
var shares = [];

sharesRef.on('value', snap => {
    shares = snap.val();
});





//Favorites
var tableFavorites = document.querySelector('#tableFavorites tbody');
var searchFavorite = document.getElementById("searchFavorite");
const favoritesRef = firebase.database().ref().child('Favorites');
var favorites = [];
var total = [];
var favoritesSize = 0;

favoritesRef.on('value', snap => {
    favorites = snap.val();
    favoritesSize = snap.numChildren()
    orderFavorites()
});

function orderFavorites() {
    var favorites = [];
    var count = 0;
    var index = 0;

    for (var i in this.favorites) {
        for (var j in this.favorites) {
            if (existFavorite(this.favorites[i]["idMusic"], favorites)) {
                count = 0;
                break;
            } else if (this.favorites[i]["idMusic"] == this.favorites[j]["idMusic"] && index + 1 <= favoritesSize - 1) {
                count++;
            } else if (this.favorites[i]["idMusic"] == this.favorites[j]["idMusic"] || index + 1 > favoritesSize - 1) {
                favorites.push(this.favorites[i]);
                total.push(count);
                count = 0;
            }
            index++;
        }
        index = 0;
    }

    this.favorites = favorites;

    refreshTableFavorites(favorites, total);
}

function existFavorite(idMusic, favorites) {
    for (var i in favorites) {
        if (favorites[i]["idMusic"] == idMusic)
            return true
    }

    return false
}

searchFavorite.addEventListener("keyup", function(event) {
    value = searchFavorite.value;
    var newFavorites = [];
    var newTotal = [];
    var count = 0;
    var alreadyFound = false;

    for (var i in favorites) {
        if (favorites[i]["id"].toLowerCase().includes(value.toLowerCase()) || favorites[i]["date"].toLowerCase().includes(value.toLowerCase()) || favorites[i]["idUser"].toLowerCase().includes(value.toLowerCase()) || favorites[i]["idMusic"].toLowerCase().includes(value.toLowerCase()) || favorites[i]["idUser"].toLowerCase().includes(value.toLowerCase()) || total[count] == value) {
            newFavorites.push(favorites[i]);
            newTotal.push(total[count]);
            alreadyFound = true;
        }
        count++;
    }

    if (!alreadyFound) {
        count = 0;
        for (var i in favorites) {
            for (var j in musics) {
                if (musics[j]["title"].toLowerCase().includes(value.toLowerCase()) && favorites[i]["idMusic"] == musics[j]["id"]) {
                    newFavorites.push(favorites[i]);
                    newTotal.push(total[count]);
                    alreadyFound = true;
                }
            }
            count++;
        }
    }

    if (!alreadyFound) {
        count = 0;
        for (var i in favorites) {
            for (var j in users) {
                if (users[j]["name"].toLowerCase().includes(value.toLowerCase()) && favorites[i]["idUser"] == users[j]["id"]) {
                    newFavorites.push(favorites[i]);
                    newTotal.push(total[count]);
                    alreadyFound = true;
                }
            }
            count++;
        }
    }

    refreshTableFavorites(newFavorites, newTotal);
});


function refreshTableFavorites(favorites, total) {
    while (tableFavorites.hasChildNodes()) {
        tableFavorites.removeChild(tableFavorites.firstChild);
    }

    for (var i in favorites) {
        row = tableFavorites.insertRow(-1);

        cell = row.insertCell(-1);
        cell.innerHTML = favorites[i]["id"];

        cell = row.insertCell(-1);
        cell.innerHTML = favorites[i]["date"];

        for (var j in users) {
            if (favorites[i]["idUser"] == users[j]["id"]) {
                cell = row.insertCell(-1);
                cell.innerHTML = users[j]["name"];
            }
        }

        for (var j in musics) {
            if (favorites[i]["idMusic"] == musics[j]["id"]) {
                cell = row.insertCell(-1);
                cell.innerHTML = musics[j]["title"];
            }
        }

        cell = row.insertCell(-1);
        cell.innerHTML = total[i];

        for (var j in shares) {
            if (favorites[i]["idMusic"] == shares[j]["idMusic"]) {
                cell = row.insertCell(-1);
                var audio = document.createElement("AUDIO");
                audio.setAttribute("src", shares[j]["link"]);
                audio.setAttribute("controls", "controls");
                cell.appendChild(audio);
            }
        }
    }
}