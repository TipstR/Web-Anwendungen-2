async function getUserGames(token) {
    let result;
    try {
        result = await $.ajax({
            url: 'http://localhost:8000/api/benutzer/spiele/' + encodeURIComponent(token.toString()),
            method: 'get',
            contentType: 'application/json; charset=utf-8',
            cache: false,
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        return result;
    } catch (error) {
        console.log(error);
    }
}

async function getGameDetails() {
    // error handling if no user is signed in
    if (localStorage.getItem('token') == null || localStorage.getItem('token') == "") {
        return null;
    }
    // wait for user games to be fetched
    const games = await getUserGames(localStorage.getItem("token"));
    const idList = games["spiele"].split(',');
    let result;
    try {
        result = await $.ajax({
            url: 'http://localhost:8000/api/spiele/gib/idList/' + encodeURIComponent(idList.toString()),
            method: 'get',
            contentType: 'application/json; charset=utf-8',
            cache: false,
            dataType: 'json'
        });
        return result;
    } catch (error) {
        console.log(error);
    }
}