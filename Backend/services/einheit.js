const helper = require('../helper.js');
const EinheitDao = require('../dao/einheitDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Einheit');

serviceRouter.get('/einheit/gib/:id', function(request, response) {
    console.log('Service Einheit: Client requested one record, id=' + request.params.id);

    const einheitDao = new EinheitDao(request.app.locals.dbConnection);
    try {
        var obj = einheitDao.loadById(request.params.id);
        console.log('Service Einheit: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Einheit: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/einheit/alle', function(request, response) {
    console.log('Service Einheit: Client requested all records');

    const einheitDao = new EinheitDao(request.app.locals.dbConnection);
    try {
        var arr = einheitDao.loadAll();
        console.log('Service Einheit: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Einheit: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/einheit/existiert/:id', function(request, response) {
    console.log('Service Einheit: Client requested check, if record exists, id=' + request.params.id);

    const einheitDao = new EinheitDao(request.app.locals.dbConnection);
    try {
        var exists = einheitDao.exists(request.params.id);
        console.log('Service Einheit: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({'id': request.params.id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Einheit: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/einheit', function(request, response) {
    console.log('Service Einheit: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');
    
    if (errorMsgs.length > 0) {
        console.log('Service Einheit: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const einheitDao = new EinheitDao(request.app.locals.dbConnection);
    try {
        var obj = einheitDao.create(request.body.bezeichnung);
        console.log('Service Einheit: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Einheit: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.put('/einheit', function(request, response) {
    console.log('Service Einheit: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');

    if (errorMsgs.length > 0) {
        console.log('Service Einheit: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const einheitDao = new EinheitDao(request.app.locals.dbConnection);
    try {
        var obj = einheitDao.update(request.body.id, request.body.bezeichnung);
        console.log('Service Einheit: Record updated, id=' + request.body.id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Einheit: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.delete('/einheit/:id', function(request, response) {
    console.log('Service Einheit: Client requested deletion of record, id=' + request.params.id);

    const einheitDao = new EinheitDao(request.app.locals.dbConnection);
    try {
        var obj = einheitDao.loadById(request.params.id);
        einheitDao.delete(request.params.id);
        console.log('Service Einheit: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Einheit: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;