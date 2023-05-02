const helper = require('../helper.js');
const BrancheDao = require('../dao/brancheDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Branche');

serviceRouter.get('/branche/gib/:id', function(request, response) {
    console.log('Service Branche: Client requested one record, id=' + request.params.id);

    const brancheDao = new BrancheDao(request.app.locals.dbConnection);
    try {
        var obj = brancheDao.loadById(request.params.id);
        console.log('Service Branche: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Branche: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/branche/alle', function(request, response) {
    console.log('Service Branche: Client requested all records');

    const brancheDao = new BrancheDao(request.app.locals.dbConnection);
    try {
        var arr = brancheDao.loadAll();
        console.log('Service Branche: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Branche: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/branche/existiert/:id', function(request, response) {
    console.log('Service Branche: Client requested check, if record exists, id=' + request.params.id);

    const brancheDao = new BrancheDao(request.app.locals.dbConnection);
    try {
        var exists = brancheDao.exists(request.params.id);
        console.log('Service Branche: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({'id': request.params.id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Branche: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/branche', function(request, response) {
    console.log('Service Branche: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');
    
    if (errorMsgs.length > 0) {
        console.log('Service Branche: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const brancheDao = new BrancheDao(request.app.locals.dbConnection);
    try {
        var obj = brancheDao.create(request.body.bezeichnung);
        console.log('Service Branche: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Branche: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.put('/branche', function(request, response) {
    console.log('Service Branche: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');

    if (errorMsgs.length > 0) {
        console.log('Service Branche: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const brancheDao = new BrancheDao(request.app.locals.dbConnection);
    try {
        var obj = brancheDao.update(request.body.id, request.body.bezeichnung);
        console.log('Service Branche: Record updated, id=' + request.body.id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Branche: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.delete('/branche/:id', function(request, response) {
    console.log('Service Branche: Client requested deletion of record, id=' + request.params.id);

    const brancheDao = new BrancheDao(request.app.locals.dbConnection);
    try {
        var obj = brancheDao.loadById(request.params.id);
        brancheDao.delete(request.params.id);
        console.log('Service Branche: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Branche: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;