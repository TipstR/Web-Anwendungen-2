const helper = require('../helper.js');
const ReservierungDao = require('../dao/reservierungDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Reservierung');

serviceRouter.get('/reservierung/gib/:id', function(request, response) {
    console.log('Service Reservierung: Client requested one record, id=' + request.params.id);

    const reservierungDao = new ReservierungDao(request.app.locals.dbConnection);
    try {
        var obj = reservierungDao.loadById(request.params.id);
        console.log('Service Reservierung: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Reservierung: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/reservierung/alle', function(request, response) {
    console.log('Service Reservierung: Client requested all records');

    const reservierungDao = new ReservierungDao(request.app.locals.dbConnection);
    try {
        var arr = reservierungDao.loadAll();
        console.log('Service Reservierung: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Reservierung: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/reservierung/existiert/:id', function(request, response) {
    console.log('Service Reservierung: Client requested check, if record exists, id=' + request.params.id);

    const reservierungDao = new ReservierungDao(request.app.locals.dbConnection);
    try {
        var exists = reservierungDao.exists(request.params.id);
        console.log('Service Reservierung: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({ 'id': request.params.id, 'existiert': exists });
    } catch (ex) {
        console.error('Service Reservierung: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/reservierung', function(request, response) {
    console.log('Service Reservierung: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.zeitpunkt)) {
        request.body.zeitpunkt = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.zeitpunkt)) {
        errorMsgs.push('zeitpunkt hat ein falsches Format, erlaubt: dd.mm.jjjj hh.mm.ss');
    } else {
        request.body.zeitpunkt = helper.parseGermanDateTimeString(request.body.zeitpunkt);
    }
    if (helper.isUndefined(request.body.reservierer)) {
        errorMsgs.push('reservierer fehlt');
    } else if (helper.isUndefined(request.body.reservierer.id)) {
        errorMsgs.push('reservierer gesetzt, aber id fehlt');
    }
    if (helper.isUndefined(request.body.zahlungsart)) {
        errorMsgs.push('zahlungsart fehlt');
    } else if (helper.isUndefined(request.body.zahlungsart.id)) {
        errorMsgs.push('zahlungsart gesetzt, aber id fehlt');
    }
    if (helper.isUndefined(request.body.vorstellung)) {
        errorMsgs.push('vorstellung fehlt');
    } else if (helper.isUndefined(request.body.vorstellung.id)) {
        errorMsgs.push('vorstellung gesetzt, aber id fehlt');
    }
    if (helper.isUndefined(request.body.reserviertesitze)) {
        errorMsgs.push('reserviertesitze fehlen');
    } else if (!helper.isArray(request.body.reserviertesitze)) {
        errorMsgs.push('reserviertesitze ist kein Array');
    } else if (request.body.reserviertesitze.length == 0) {
        errorMsgs.push('reserviertesitze sind leer, nichts zu speichern');
    }
    
    if (errorMsgs.length > 0) {
        console.log('Service Reservierung: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const reservierungDao = new ReservierungDao(request.app.locals.dbConnection);
    try {
        var obj = reservierungDao.create(request.body.zeitpunkt, request.body.reservierer.id, request.body.zahlungsart.id, request.body.vorstellung.id, request.body.reserviertesitze);
        console.log('Service Reservierung: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Reservierung: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.put('/reservierung', function(request, response) {
    console.log('Service Reservierung: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.zeitpunkt)) {
        request.body.zeitpunkt = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.zeitpunkt)) {
        errorMsgs.push('zeitpunkt hat ein falsches Format, erlaubt: dd.mm.jjjj hh.mm.ss');
    } else {
        request.body.zeitpunkt = helper.parseGermanDateTimeString(request.body.zeitpunkt);
    }
    if (helper.isUndefined(request.body.reservierer)) {
        errorMsgs.push('reservierer fehlt');
    } else if (helper.isUndefined(request.body.reservierer.id)) {
        errorMsgs.push('reservierer gesetzt, aber id fehlt');
    }
    if (helper.isUndefined(request.body.zahlungsart)) {
        errorMsgs.push('zahlungsart fehlt');
    } else if (helper.isUndefined(request.body.zahlungsart.id)) {
        errorMsgs.push('zahlungsart gesetzt, aber id fehlt');
    }
    if (helper.isUndefined(request.body.vorstellung)) {
        errorMsgs.push('vorstellung fehlt');
    } else if (helper.isUndefined(request.body.vorstellung.id)) {
        errorMsgs.push('vorstellung gesetzt, aber id fehlt');
    }
    if (helper.isUndefined(request.body.reserviertesitze)) {
        errorMsgs.push('reserviertesitze fehlen');
    } else if (!helper.isArray(request.body.reserviertesitze)) {
        errorMsgs.push('reserviertesitze ist kein Array');
    } else if (request.body.reserviertesitze.length == 0) {
        errorMsgs.push('reserviertesitze sind leer, nichts zu speichern');
    }

    if (errorMsgs.length > 0) {
        console.log('Service Reservierung: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const reservierungDao = new ReservierungDao(request.app.locals.dbConnection);
    try {
        var obj = reservierungDao.update(request.body.id, request.body.zeitpunkt, request.body.reservierer.id, request.body.zahlungsart.id, request.body.vorstellung.id, request.body.reserviertesitze);
        console.log('Service Reservierung: Record updated, id=' + request.body.id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Reservierung: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.delete('/reservierung/:id', function(request, response) {
    console.log('Service Reservierung: Client requested deletion of record, id=' + request.params.id);

    const reservierungDao = new ReservierungDao(request.app.locals.dbConnection);
    try {
        var obj = reservierungDao.loadById(request.params.id);
        reservierungDao.delete(request.params.id);
        console.log('Service Reservierung: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Reservierung: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;