async function getUserGames(id) {
    let result;
    console.log("Trying to get authorization with token: " + localStorage.getItem('token'));
    let authHeader = "Authorization: Bearer " + localStorage.getItem('token');
    try {
        result = await $.ajax({
            url: 'http://localhost:8000/api/benutzer/spiele/' + encodeURIComponent(id.toString()),
            method: 'get',
            contentType: 'application/json; charset=utf-8',
            cache: false,
            dataType: 'jsonp',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        });

        return result;
    } catch (error) {
        console.log(error);
    }

}

async function getGameDetails() {
    // error handling if no user is signed in
    if (localStorage.getItem('Benutzer') == null || localStorage.getItem('Benutzer') == "") {
        return null;
    }
    // wait for user games to be fetched
    const games = await getUserGames(localStorage.getItem('Benutzer'));
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