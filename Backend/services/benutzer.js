const helper = require('../helper.js');
const BenutzerDao = require('../dao/benutzerDao.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const tokenHandling = require('../tokenHandling.js');
const serviceRouter = express.Router();

console.log('- Service benutzer');

serviceRouter.get('/benutzer/gib/:token', function(request, response) {
    console.log('Service benutzer: Client requested one record, token=' + request.params.token);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        const userId = tokenHandling.decodeToken(request.params.token);
        var obj = benutzerDao.loadById(userId);
        console.log('Service benutzer: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service benutzer: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/benutzer/alle', function(request, response) {
    console.log('Service benutzer: Client requested all records');

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var arr = benutzerDao.loadAll();
        console.log('Service benutzer: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service benutzer: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/benutzer/spiele/:token', tokenHandling.checkToken, function(request, response) {
    console.log('Service benutzer: Client requested all records');

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        const userId = tokenHandling.decodeToken(request.params.token);
        const arr = benutzerDao.loadUserGames(userId);
        console.log('Service benutzer: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service benutzer: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});


serviceRouter.get('/benutzer/eindeutig/:benutzername/:email', function(request, response) {
    console.log('Service benutzer: Client requested check, if username and email are unique');
    console.log(request.params)

    var errorMsgs = [];
    if (helper.isUndefined(request.params.benutzername))
        errorMsgs.push('benutzername fehlt');

    if (helper.isUndefined(request.params.email))
        errorMsgs.push('email fehlt');

    if (errorMsgs.length > 0) {
        console.log('Service benutzer: check not possible, data missing');
        response.status(400).json({
            'fehler': true,
            'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)
        });
        return;
    }

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var usernameUnique = benutzerDao.isUniqueUsername(request.params.benutzername);
        var emailUnique = benutzerDao.isUniqueEmail(request.params.email);
        var unique = usernameUnique && emailUnique;
        console.log('Service benutzer: Check if unique, unique=' + unique);
        response.status(200).json({'email': request.params.email, 'benutzername': request.params.benutzername, 'email_eindeutig': emailUnique, 'benutzername_eindeutig': usernameUnique, 'eindeutig': unique});
    } catch (ex) {
        console.error('Service benutzer: Error checking if unique. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.get('/benutzer/existiert/:id', function(request, response) {
    console.log('Service benutzer: Client requested check, if record exists, id=' + request.params.id);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var exists = benutzerDao.exists(request.params.id);
        console.log('Service benutzer: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({ 'id': request.params.id, 'existiert': exists });
    } catch (ex) {
        console.error('Service benutzer: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/benutzer', function(request, response) {
    console.log('Service benutzer: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.benutzername))
        errorMsgs.push('benutzername fehlt');
    if (helper.isUndefined(request.body.email))
        errorMsgs.push('email fehlt');
    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('passwort fehlt');


    if (errorMsgs.length > 0) {
        console.log('Service benutzer: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.create(request.body.benutzername,request.body.email, request.body.passwort);
        console.log('Service benutzer: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        if(ex.code === "SQLITE_CONSTRAINT_UNIQUE") {
            console.error('Service Benutzer: Error creating new record. Exception occured: ' + ex.message);
            response.status(400).json({ 'fehler': true, 'nachricht': "Benutzer existiert bereits!" });

            return;
        }

        console.error('Service benutzer: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.put('/benutzer', function(request, response) {
    console.log('Service benutzer: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id))
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.benutzername))
        errorMsgs.push('benutzername fehlt');
    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('passwort fehlt');


    if (errorMsgs.length > 0) {
        console.log('Service benutzer: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.update(request.body.benutzername, request.body.email, request.body.benutzername);
        console.log('Service benutzer: Record updated, id=' + request.body.id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service benutzer: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.put('/benutzer/updateWarenkorb/:token/:gameId', tokenHandling.checkToken, function(request, response) {
    console.log('Service benutzer: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.params.token))
        errorMsgs.push('token fehlt');
    if (helper.isUndefined(request.params.gameId))
        errorMsgs.push('gameIds fehlt');


    if (errorMsgs.length > 0) {
        console.log('Service benutzer: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const userId = tokenHandling.decodeToken(request.params.token);
    console.log(userId);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.addItemToCart(userId, request.params.gameId);
        console.log('Service benutzer: Record updated, id=' + userId);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service benutzer: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/benutzer/warenkorb/:token', tokenHandling.checkToken, function(request, response) {
    console.log('Service benutzer: Client requested all records');

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        const userId = tokenHandling.decodeToken(request.params.token);
        const arr = benutzerDao.loadCart(userId);
        console.log('Service benutzer: Records loaded, result=' + arr);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service benutzer: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.put('/benutzer/updateNutzerspiele/:token/:gameIds', tokenHandling.checkToken, function(request, response) {
    console.log('Service benutzer: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.params.token))
        errorMsgs.push('token fehlt');
    if (helper.isUndefined(request.params.gameIds))
        errorMsgs.push('gameIds fehlt');


    if (errorMsgs.length > 0) {
        console.log('Service benutzer: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const userId = tokenHandling.decodeToken(request.params.token);
    console.log(userId);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.updateUserGames(userId, request.params.gameIds);
        console.log('Service benutzer: Record updated, id=' + userId);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service benutzer: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.delete('/benutzer/:id', function(request, response) {
    console.log('Service benutzer: Client requested deletion of record, id=' + request.params.id);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.loadById(request.params.id);
        benutzerDao.delete(request.params.id);
        console.log('Service benutzer: Deletion of record successful, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service benutzer: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.delete('/benutzer/warenkorb/:token', tokenHandling.checkToken, function(request, response) {
    console.log('Service benutzer: Client requested deletion of record, token=' + request.params.token);

    const userId = tokenHandling.decodeToken(request.params.token);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        benutzerDao.deleteCart(userId);
        obj = benutzerDao.loadById(userId);
        console.log('Service benutzer: Deletion of record successful, id=' + userId);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service benutzer: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.delete('/benutzer/warenkorb/:token/:gameId', tokenHandling.checkToken, function(request, response) {
    console.log('Service benutzer: Client requested deletion of record, token=' + request.params.token);

    const userId = tokenHandling.decodeToken(request.params.token);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        benutzerDao.deleteItemFromCart(userId, request.params.gameId);
        obj = benutzerDao.loadById(userId);
        console.log('Service benutzer: Deletion of record successful, id=' + userId);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service benutzer: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/benutzer/login', function(request, response) {
    console.log('Service benutzer: Client requested check, if user has access');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.email))
        errorMsgs.push('email fehlt');
    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('passwort fehlt');

    if (errorMsgs.length > 0) {
        console.log('Service benutzer: check not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    let access = false;
    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var hasAccess = benutzerDao.hasAccess(request.body.email, request.body.passwort);
        console.log('Service benutzer: Check if user has access, hasaccess=' + hasAccess);
        // response.status(200).json(hasAccess);
        access = true;
    } catch (ex) {
        console.error('Service benutzer: Error checking if user has access. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }

    if (access) {
        jwt.decode()
        let token = jwt.sign({id: hasAccess.id},
            tokenHandling.secret,
            { expiresIn: '24h' // expires in 24 hours
            }
        );

        response.token = token;

        //console.log(response.token);
        //console.log(response);
        hasAccess.token = token;
        console.log(hasAccess);
        response.status(200).json(hasAccess);

    }

});

module.exports = serviceRouter;