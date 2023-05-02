const helper = require('../helper.js');
const ZutatDao = require('../dao/zutatDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Zutat');

serviceRouter.get('/zutat/gib/:id', function(request, response) {
    console.log('Service Zutat: Client requested one record, id=' + request.params.id);

    const zutatDao = new ZutatDao(request.app.locals.dbConnection);
    try {
        var obj = zutatDao.loadById(request.params.id);
        console.log('Service Zutat: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Zutat: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/zutat/alle', function(request, response) {
    console.log('Service Zutat: Client requested all records');

    const zutatDao = new ZutatDao(request.app.locals.dbConnection);
    try {
        var arr = zutatDao.loadAll();
        console.log('Service Zutat: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Zutat: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/zutat/existiert/:id', function(request, response) {
    console.log('Service Zutat: Client requested check, if record exists, id=' + request.params.id);

    const zutatDao = new ZutatDao(request.app.locals.dbConnection);
    try {
        var exists = zutatDao.exists(request.params.id);
        console.log('Service Zutat: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({'id': request.params.id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Zutat: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/zutat', function(request, response) {
    console.log('Service Zutat: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');
    if (helper.isUndefined(request.body.beschreibung)) 
        request.body.beschreibung = '';
    
    if (errorMsgs.length > 0) {
        console.log('Service Zutat: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const zutatDao = new ZutatDao(request.app.locals.dbConnection);
    try {
        var obj = zutatDao.create(request.body.bezeichnung, request.body.beschreibung);
        console.log('Service Zutat: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Zutat: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.put('/zutat', function(request, response) {
    console.log('Service Zutat: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt')
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');
    if (helper.isUndefined(request.body.beschreibung)) 
        request.body.beschreibung = '';

    if (errorMsgs.length > 0) {
        console.log('Service Zutat: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const zutatDao = new ZutatDao(request.app.locals.dbConnection);
    try {
        var obj = zutatDao.update(request.body.id, request.body.bezeichnung, request.body.beschreibung);
        console.log('Service Zutat: Record updated, id=' + request.body.id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Zutat: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.delete('/zutat/:id', function(request, response) {
    console.log('Service Zutat: Client requested deletion of record, id=' + request.params.id);

    const zutatDao = new ZutatDao(request.app.locals.dbConnection);
    try {
        var obj = zutatDao.loadById(request.params.id);
        zutatDao.delete(request.params.id);
        console.log('Service Zutat: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Zutat: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;