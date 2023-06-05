const helper = require('../helper.js');
const fileHelper = require('../fileHelper.js');
const path = require('path');
const SpieleDao = require('../dao/spieleDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Spiele');

serviceRouter.get('/spiele/gib/:id', function(request, response) {
    console.log('Service Spiele: Client requested one record, id=' + request.params.id);

    const spieleDao = new SpieleDao(request.app.locals.dbConnection);
    try {
        var obj = spieleDao.loadById(request.params.id);
        console.log('Service Spiele: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Spiele: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/spiele/gib/idList/:idList', function(request, response) {
    console.log(decodeURIComponent(request.params.idList));
    console.log('Service Spiele: Client requested one record, idList=' + request.params.idList);
    console.log("idListSplit" + request.params.idList.split(','));

    const spieleDao = new SpieleDao(request.app.locals.dbConnection);
    try {
        const arr = spieleDao.loadByIdList(request.params.idList.split(','));
        console.log('Service Spiele: Record loaded');
        console.log('arr: ' + arr);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Spiele: Error loading games by id list. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/spiele/alle', function(request, response) {
    console.log('Service Spiele: Client requested all records');

    const spieleDao = new SpieleDao(request.app.locals.dbConnection);
    try {
        const arr = spieleDao.loadAll();
        console.log('Service Spiele: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Spiele: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/spiele/existiert/:id', function(request, response) {
    console.log('Service Spiele: Client requested check, if record exists, id=' + request.params.id);

    const spieleDao = new SpieleDao(request.app.locals.dbConnection);
    try {
        var exists = spieleDao.exists(request.params.id);
        console.log('Service Spiele: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({'id': request.params.id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Spiele: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/spiele', function(request, response) {
    console.log('Service Spiele: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.name))
        errorMsgs.push('name fehlt');
    if (helper.isUndefined(request.body.cover_pfad))
        errorMsgs.push('cover_pfad fehlt');
    if (helper.isUndefined(request.body.beschreibung))
        errorMsgs.push('beschreibung fehlt');
    if (helper.isUndefined(request.body.klappentext))
        errorMsgs.push('klappentext fehlt');


    if (errorMsgs.length > 0) {
        console.log('Service spiele: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const spieleDao = new SpieleDao(request.app.locals.dbConnection);
    try {
        var obj = spieleDao.create(request.body.name, request.body.cover_pfad, request.body.beschreibung, request.klappentext);
        console.log('Service Spiele: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Spiele: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/spiele/bewertungen/:spiele_id/:benutzername/:bewertungstext/:sterneanzahl', function(request, response) {
    console.log('Service Spiele: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.params.spiele_id))
        errorMsgs.push('spiele_id fehlt');
    if (helper.isUndefined(request.params.benutzername))
        errorMsgs.push('benutzername fehlt');
    if (helper.isUndefined(request.params.bewertungstext))
        errorMsgs.push('bewertungstext fehlt');
    if (helper.isUndefined(request.params.sterneanzahl))
        errorMsgs.push('sterneanzahl fehlt');


    if (errorMsgs.length > 0) {
        console.log('Service spiele: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const spieleDao = new SpieleDao(request.app.locals.dbConnection);
    try {
        var obj = spieleDao.createReview(request.params.spiele_id, request.params.benutzername, request.params.bewertungstext, request.params.sterneanzahl);
        console.log('Service Spiele: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Spiele: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/spiele/bewertungen/:spiele_id', function(request, response) {
    console.log('Service Spiele: Client requested all records');

    const spieleDao = new SpieleDao(request.app.locals.dbConnection);
    try {
        const arr = spieleDao.loadReviews(request.params.spiele_id);
        console.log('Service Spiele: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Spiele: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.put('/spiele', function(request, response) {
    console.log('Service spiele: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.name))
        errorMsgs.push('name fehlt');
    if (helper.isUndefined(request.body.cover_pfad))
        errorMsgs.push('cover_pfad fehlt');
    if (helper.isUndefined(request.body.beschreibung))
        errorMsgs.push('beschreibung fehlt');
    if (helper.isUndefined(request.body.klappentext))
        errorMsgs.push('klappentext fehlt');

    if (errorMsgs.length > 0) {
        console.log('Service Spiele: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const spieleDao = new SpieleDao(request.app.locals.dbConnection);
    try {
        var obj = spieleDao.update(request.body.id, request.body.name, request.body.cover_pfad, request.body.beschreibung, request.body.klappentext);
        console.log('Service Spiele: Record updated, id=' + request.body.id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Spiele: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.delete('/spiele/:id', function(request, response) {
    console.log('Service Spiele: Client requested deletion of record, id=' + request.params.id);

    const spieleDao = new SpieleDao(request.app.locals.dbConnection);
    try {
        var obj = spieleDao.loadById(request.params.id);
        spieleDao.delete(request.params.id);
        console.log('Service Spiele: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service spiele: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/spiele/aufladen', async(request, response) => {
    console.log('Service Spiele: upload multiple pictures called');
    const spieleDao = new SpieleDao(request.app.locals.dbConnection);

    try {
        // if no files received, send error
        if (!fileHelper.hasUploadedFiles(request)) {
            console.log('no files transmitted, nothing to do');
            response.status(400).json({'fehler': true, 'nachricht': 'Keine Dateien aufgeladen'});
        } else {

            console.log('count of uploaded files ' + fileHelper.cntUploadedFiles(request));

            // get all file objects
            var files = fileHelper.getAllUplodedFilesAsArray(request, true);

            var savedFiles = [];

            // now walk array and save files in db and on hdd, only if web picture AND if not already in folder
            files.forEach(function(item) {
                console.log('processing file: ' + item.name);

                // get target path
                const targetPath = path.resolve(process.cwd(), 'public', 'spiele', item.name);
                console.log('target Path: ' + targetPath);

                if (item.isWebPicture && !fileHelper.existsFile(targetPath)) {
                    console.log('item is webPicture and not present');                    

                    // create target obj
                    var fileObj = {
                        status: true,
                        fileSaved: false,
                        fileName: item.name,
                        fileSize: item.size,
                        fileMimeType: item.mimetype,
                        fileEncoding: item.encoding,
                        fileHandle: item.handleName,
                        fileNameOnly: item.nameOnly,
                        fileExtension: item.extension,
                        fileIsPicture: item.isPicture, 
                        fileIsWebPicture: item.isWebPicture
                    };
                    
                    // now try to save file info in db
                    try {
                        var savedObj = spieleDao.create(fileObj.fileName, fileObj.fileSize, fileObj.fileMimeType, 'spiele/' + fileObj.fileName, helper.getNow());
                        console.log('Service spiele: Record inserted in db, id=' + savedObj.id);
                        // transfer file to target folder with target name
                        item.mv(targetPath);
                        // remember status
                        fileObj.fileSaved = true;
                        // set to array
                        savedFiles.push(fileObj);
                    } catch (ex) {
                        console.error('Service Spiele: Error creating record. Exception occured: ' + ex.message);
                    }
                } else {
                    console.log('item is no webPicture or already present, skipping it');
                }
            });

            // send response 
            response.status(200).json(savedFiles);
        }

    } catch (err) {        
        response.status(400).json({'fehler': true, 'nachricht': 'Fehler im Service'});
    }
    
});

module.exports = serviceRouter;