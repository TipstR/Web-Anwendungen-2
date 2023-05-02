const helper = require('../helper.js');
const FilmgenreDao = require('../dao/filmgenreDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Filmgenre');

serviceRouter.get('/filmgenre/gib/:id', function(request, response) {
    console.log('Service Filmgenre: Client requested one record, id=' + request.params.id);

    const filmgenreDao = new FilmgenreDao(request.app.locals.dbConnection);
    try {
        var obj = filmgenreDao.loadById(request.params.id);
        console.log('Service Filmgenre: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Filmgenre: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/filmgenre/alle', function(request, response) {
    console.log('Service Filmgenre: Client requested all records');

    const filmgenreDao = new FilmgenreDao(request.app.locals.dbConnection);
    try {
        var arr = filmgenreDao.loadAll();
        console.log('Service Filmgenre: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Filmgenre: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/filmgenre/existiert/:id', function(request, response) {
    console.log('Service Filmgenre: Client requested check, if record exists, id=' + request.params.id);

    const filmgenreDao = new FilmgenreDao(request.app.locals.dbConnection);
    try {
        var exists = filmgenreDao.exists(request.params.id);
        console.log('Service Filmgenre: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({'id': request.params.id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Filmgenre: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/filmgenre', function(request, response) {
    console.log('Service Filmgenre: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');
    
    if (errorMsgs.length > 0) {
        console.log('Service Filmgenre: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const filmgenreDao = new FilmgenreDao(request.app.locals.dbConnection);
    try {
        var obj = filmgenreDao.create(request.body.bezeichnung);
        console.log('Service Filmgenre: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Filmgenre: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.put('/filmgenre', function(request, response) {
    console.log('Service Filmgenre: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');

    if (errorMsgs.length > 0) {
        console.log('Service Filmgenre: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const filmgenreDao = new FilmgenreDao(request.app.locals.dbConnection);
    try {
        var obj = filmgenreDao.update(request.body.id, request.body.bezeichnung);
        console.log('Service Filmgenre: Record updated, id=' + request.body.id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Filmgenre: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.delete('/filmgenre/:id', function(request, response) {
    console.log('Service Filmgenre: Client requested deletion of record, id=' + request.params.id);

    const filmgenreDao = new FilmgenreDao(request.app.locals.dbConnection);
    try {
        var obj = filmgenreDao.loadById(request.params.id);
        filmgenreDao.delete(request.params.id);
        console.log('Service Filmgenre: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Filmgenre: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;