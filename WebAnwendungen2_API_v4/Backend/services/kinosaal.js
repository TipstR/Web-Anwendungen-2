const helper = require('../helper.js');
const KinosaalDao = require('../dao/kinosaalDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Kinosaal');

serviceRouter.get('/kinosaal/gib/:id', function(request, response) {
    console.log('Service Kinosaal: Client requested one record, id=' + request.params.id);

    const kinosaalDao = new KinosaalDao(request.app.locals.dbConnection);
    try {
        var obj = kinosaalDao.loadById(request.params.id);
        console.log('Service Kinosaal: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Kinosaal: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/kinosaal/alle', function(request, response) {
    console.log('Service Kinosaal: Client requested all records');

    const kinosaalDao = new KinosaalDao(request.app.locals.dbConnection);
    try {
        var arr = kinosaalDao.loadAll();
        console.log('Service Kinosaal: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Kinosaal: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/kinosaal/existiert/:id', function(request, response) {
    console.log('Service Kinosaal: Client requested check, if record exists, id=' + request.params.id);

    const kinosaalDao = new KinosaalDao(request.app.locals.dbConnection);
    try {
        var exists = kinosaalDao.exists(request.params.id);
        console.log('Service Kinosaal: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({ 'id': request.params.id, 'existiert': exists });
    } catch (ex) {
        console.error('Service Kinosaal: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/kinosaal', function(request, response) {
    console.log('Service Kinosaal: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');
    if (helper.isUndefined(request.body.leinwand)) 
        errorMsgs.push('leinwand fehlt');
    if (!helper.isNumeric(request.body.leinwand)) 
        errorMsgs.push('leinwand muss eine Zahl sein');
    if (request.body.leinwand <= 0) 
        errorMsgs.push('leinwand muss eine Zahl > 0 sein');
    if (helper.isUndefined(request.body.tonsystem)) 
        request.body.tonsystem = '';
    if (helper.isUndefined(request.body.projektion)) 
        request.body.projektion = '';
    if (helper.isUndefined(request.body.projektionsart)) {
        errorMsgs.push('projektionsart fehlt');
    } else if (request.body.projektionsart.toLowerCase() !== '2d' && request.body.projektionsart.toLowerCase() !== '3d') {
        errorMsgs.push('projektionsart falsch. Erlaubt ist 2d bzw. 3d');
    }
    if (helper.isUndefined(request.body.sitzreihen)) 
        errorMsgs.push('sitzreihen fehlen');
    if (!helper.isNumeric(request.body.sitzreihen)) 
        errorMsgs.push('sitzreihen müssen eine Zahl sein');
    if (request.body.sitzreihen <= 0) 
        errorMsgs.push('sitzreihen müssen eine Zahl > 0 sein');
    if (helper.isUndefined(request.body.sitzeproreihe)) 
        errorMsgs.push('sitzeproreihe fehlt');
    if (!helper.isNumeric(request.body.sitzeproreihe)) 
        errorMsgs.push('sitzeproreihe muss eine Zahl sein');
    if (request.body.sitzeproreihe <= 0) 
        errorMsgs.push('sitzeproreihe muss eine Zahl > 0 sein');
    if (helper.isUndefined(request.body.geschoss)) 
        request.body.geschoss = '';
    
    if (errorMsgs.length > 0) {
        console.log('Service Kinosaal: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const kinosaalDao = new KinosaalDao(request.app.locals.dbConnection);
    try {
        var obj = kinosaalDao.create(request.body.bezeichnung, request.body.leinwand, request.body.tonsystem, request.body.projektion, request.body.projektionsart, request.body.sitzreihen, request.body.sitzeproreihe, request.body.geschoss);
        console.log('Service Kinosaal: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Kinosaal: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.put('/kinosaal', function(request, response) {
    console.log('Service Kinosaal: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push('id fehlt');
    if (helper.isUndefined(request.body.bezeichnung)) 
        errorMsgs.push('bezeichnung fehlt');
    if (helper.isUndefined(request.body.leinwand)) 
        errorMsgs.push('leinwand fehlt');
    if (!helper.isNumeric(request.body.leinwand)) 
        errorMsgs.push('leinwand muss eine Zahl sein');
    if (request.body.leinwand <= 0) 
        errorMsgs.push('leinwand muss eine Zahl > 0 sein');
    if (helper.isUndefined(request.body.tonsystem)) 
        request.body.tonsystem = '';
    if (helper.isUndefined(request.body.projektion)) 
        request.body.projektion = '';
    if (helper.isUndefined(request.body.projektionsart)) {
        errorMsgs.push('projektionsart fehlt');
    } else if (request.body.projektionsart.toLowerCase() !== '2d' && request.body.projektionsart.toLowerCase() !== '3d') {
        errorMsgs.push('projektionsart falsch. Erlaubt ist 2d bzw. 3d');
    }
    if (helper.isUndefined(request.body.sitzreihen)) 
        errorMsgs.push('sitzreihen fehlen');
    if (!helper.isNumeric(request.body.sitzreihen)) 
        errorMsgs.push('sitzreihen müssen eine Zahl sein');
    if (request.body.sitzreihen <= 0) 
        errorMsgs.push('sitzreihen müssen eine Zahl > 0 sein');
    if (helper.isUndefined(request.body.sitzeproreihe)) 
        errorMsgs.push('sitzeproreihe fehlt');
    if (!helper.isNumeric(request.body.sitzeproreihe)) 
        errorMsgs.push('sitzeproreihe muss eine Zahl sein');
    if (request.body.sitzeproreihe <= 0) 
        errorMsgs.push('sitzeproreihe muss eine Zahl > 0 sein');
    if (helper.isUndefined(request.body.geschoss)) 
        request.body.geschoss = '';

    if (errorMsgs.length > 0) {
        console.log('Service Kinosaal: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const kinosaalDao = new KinosaalDao(request.app.locals.dbConnection);
    try {
        var obj = kinosaalDao.update(request.body.id, request.body.bezeichnung, request.body.leinwand, request.body.tonsystem, request.body.projektion, request.body.projektionsart, request.body.sitzreihen, request.body.sitzeproreihe, request.body.geschoss);
        console.log('Service Kinosaal: Record updated, id=' + request.body.id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Kinosaal: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.delete('/kinosaal/:id', function(request, response) {
    console.log('Service Kinosaal: Client requested deletion of record, id=' + request.params.id);

    const kinosaalDao = new KinosaalDao(request.app.locals.dbConnection);
    try {
        var obj = kinosaalDao.loadById(request.params.id);
        kinosaalDao.delete(request.params.id);
        console.log('Service Kinosaal: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Kinosaal: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;