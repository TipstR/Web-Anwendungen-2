const helper = require('../helper.js');
const BenutzerDao = require('../dao/benutzerDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service benutzer');

serviceRouter.get('/benutzer/gib/:id', function(request, response) {
    console.log('Service benutzer: Client requested one record, id=' + request.params.id);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.loadById(request.params.id);
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

serviceRouter.get('/benutzer/eindeutig', function(request, response) {
    console.log('Service benutzer: Client requested check, if username is unique');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.benutzername))
        errorMsgs.push('benutzername fehlt');

    if (errorMsgs.length > 0) {
        console.log('Service benutzer: check not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var unique = benutzerDao.isunique(request.body.benutzername);
        console.log('Service benutzer: Check if unique, unique=' + unique);
        response.status(200).json({ 'benutzername': request.body.benutzername, 'eindeutig': unique });
    } catch (ex) {
        console.error('Service benutzer: Error checking if unique. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
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

serviceRouter.delete('/benutzer/:id', function(request, response) {
    console.log('Service benutzer: Client requested deletion of record, id=' + request.params.id);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var obj = benutzerDao.loadById(request.params.id);
        benutzerDao.delete(request.params.id);
        console.log('Service benutzer: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service benutzer: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/benutzer/login', function(request, response) {
    console.log('Service benutzer: Client requested check, if user has access');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.benutzername))
        errorMsgs.push('benutzername fehlt');
    if (helper.isUndefined(request.body.passwort))
        errorMsgs.push('passwort fehlt');

    if (errorMsgs.length > 0) {
        console.log('Service benutzer: check not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        var hasaccess = benutzerDao.hasaccess(request.body.benutzername, request.body.passwort);
        console.log('Service benutzer: Check if user has access, hasaccess=' + hasaccess);
        response.status(200).json(hasaccess);
    } catch (ex) {
        console.error('Service benutzer: Error checking if user has access. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;