const displayNames = {
    "adventure": "Abenteuer",
    "action": "Action",
    "arcade": "Arcade",
    "free2play": "Free To Play",
    "casual": "Gelegenheitsspiel",
    "horror": "Horror",
    "comp": "Wettbewerb",
    "moba": "MOBA",
    "neu": "Neue Spiele",
    "openWorld": "Offene Welt",
    "rpg": "Rollenspiel",
    "fps": "FPS",
    "trending": "Trending",
    "survival": "Überleben",
    "management": "Management",
    "single": "Einzelspieler",
    "multi": "Mehrspieler"
}

function submitSearch(mode) {
    const genreDict = {
        "adventure": document.getElementById("adventure").checked,
        "action": document.getElementById("action").checked,
        "arcade": document.getElementById("arcade").checked,
        "free2play": document.getElementById("free2play").checked,
        "casual": document.getElementById("casual").checked,
        "horror": document.getElementById("horror").checked,
        "comp": document.getElementById("comp").checked,
        "moba": document.getElementById("moba").checked,
        "neu": document.getElementById("neu").checked,
        "openWorld": document.getElementById("openWorld").checked,
        "rpg": document.getElementById("rpg").checked,
        "fps": document.getElementById("fps").checked,
        "trending": document.getElementById("trending").checked,
        "survival": document.getElementById("survival").checked,
        "management": document.getElementById("management").checked,
        "single": document.getElementById("single").checked,
        "multi": document.getElementById("multi").checked,
        "suche": document.getElementById("suche").value
    }

    let url;

    switch(mode) {
        case "inSearch":
            url = "search.html?tags=";
            break;

        case "inIndex":
            url = "html/search.html?tags=";
            break;

        case "inLibrary":
            url = "library.html?tags=";
            break;

        default:
            console.log("unknown mode!");
            return;
    }


    for (let key in genreDict) {
        if (key === "suche") {
            if (genreDict[key] === '') {
                url = url.substring(0, url.length - 3);
            } else {
                url = url.substring(0, url.length - 3) + "&search=" + encodeURIComponent(genreDict[key]);
            }

        } else {
            if (genreDict[key]) {
                url += key + "%2C";
            }
        }
    }

    location.href = url;

}

