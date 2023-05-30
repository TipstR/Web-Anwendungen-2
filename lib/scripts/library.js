function getUserGames(id) {
    return $.ajax({
        url: 'http://localhost:8000/api/benutzer/spiele/' + encodeURIComponent(id.toString()),
        method: 'get',
        contentType: 'application/json; charset=utf-8',
        cache: false,
        dataType: 'json'
    }).done(function (response) {



    }).fail(function (jqXHR, statusText, error) {
        console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
        alert('Ein Fehler ist aufgetreten');
    });
}

function getGameDetails() {
    return $.when(getUserGames(localStorage.getItem('Benutzer'))).done(function (games) {
        const idList = games["spiele"].split(', ');
        console.log(getUserGames(localStorage.getItem('Benutzer')));
        console.log("Ich bin angekommen!");
        $.ajax({
            url: 'http://localhost:8000/api/spiele/gib/idList/' + encodeURIComponent(idList.toString()),
            method: 'get',
            contentType: 'application/json; charset=utf-8',
            cache: false,
            dataType: 'json'
        }).done(function (response) {



        }).fail(function (jqXHR, statusText, error) {
            console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
            alert('Ein Fehler ist aufgetreten');
        });
    });
}