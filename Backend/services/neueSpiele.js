const helper = require('../helper.js');
const fileHelper = require('../fileHelper.js');
const path = require('path');
const NeueSpieleDao = require('../dao/neueSpieleDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service neueSpiele');

serviceRouter.get('/neueSpiele/gib/:spiele_id', function (request, response) {
    console.log('Service neueSpiele: Client requested one record, spiele_id=' + request.params.spiele_id);

    const neueSpieleDao = new NeueSpieleDao(request.app.locals.dbConnection);
    try {
        var obj = neueSpieleDao.loadById(request.params.spiele_id);
        console.log('Service neueSpiele: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service neueSpiele: Error loading record by spiele_id. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.get('/neueSpiele/alle', function (request, response) {
    console.log('Service Spiele: Client requested all records');

    const neueSpieleDao = new NeueSpieleDao(request.app.locals.dbConnection);
    try {
        var arr = neueSpieleDao.loadAll();
        console.log('Service neueSpiele: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service neueSpiele: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.get('/neueSpiele/existiert/:spiele_id', function (request, response) {
    console.log('Service neueSpiele: Client requested check, if record exists, spiele_id=' + request.params.spiele_id);

    const neueSpieleDao = new NeueSpieleDao(request.app.locals.dbConnection);
    try {
        var exists = neueSpieleDao.exists(request.params.spiele_id);
        console.log('Service Spiele: Check if record exists by spiele_id=' + request.params.spiele_id + ', exists=' + exists);
        response.status(200).json({'spiele_id': request.params.spiele_id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Spiele: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.post('/neueSpiele', function (request, response) {
    console.log('Service Spiele: Client requested creation of new record');

    var errorMsgs = [];
    if (helper.isUndefined(request.body.spiele_name))
        errorMsgs.push('spiele_name fehlt');
    // TODO Für ALLE Daten


    if (errorMsgs.length > 0) {
        console.log('Service neueSpiele: Creation not possible, data missing');
        response.status(400).json({
            'fehler': true,
            'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)
        });
        return;
    }

    const neueSpieleDao = new NeueSpieleDao(request.app.locals.dbConnection);
    try {
        var obj = neueSpieleDao.create(request.body.spiele_name);
        console.log('Service Spiele: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Spiele: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.put('/neueSpiele', function (request, response) {
    console.log('Service neueSpiele: Client requested update of existing record');

    var errorMsgs = [];
    if (helper.isUndefined(request.body.spiele_name))
        errorMsgs.push('spiele_name fehlt');
    // TODO Für ALLE Daten

    if (errorMsgs.length > 0) {
        console.log('Service neueSpiele: Update not possible, data missing');
        response.status(400).json({
            'fehler': true,
            'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)
        });
        return;
    }

    const neueSpieleDao = new NeueSpieleDao(request.app.locals.dbConnection);
    try {
        var obj = neueSpieleDao.create(request.body.spiele_name);
        console.log('Service neueSpiele: Record updated, spiele_id=' + request.body.spiele_id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service neueSpiele: Error updating record by spiele_id. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.delete('/neueSpiele/:spiele_id', function (request, response) {
    console.log('Service neueSpiele: Client requested deletion of record, spiele_id=' + request.params.spiele_id);

    const neueSpieleDao = new NeueSpieleDao(request.app.locals.dbConnection);
    try {
        var obj = neueSpieleDao.loadById(request.params.spiele_id);
        neueSpieleDao.delete(request.params.spiele_id);
        console.log('Service neueSpiele: Deletion of record successfull, spiele_id=' + request.params.spiele_id);
        response.status(200).json({'gelöscht': true, 'eintrag': obj});
    } catch (ex) {
        console.error('Service neueSpielee: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.post('/neueSpiele/aufladen', async (request, response) => {
    console.log('Service neueSpiele: upload multiple pictures called');
    const neueSpieleDao = new neueSpieleDao(request.app.locals.dbConnection);

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
            files.forEach(function (item) {
                console.log('processing file: ' + item.name);

                // get target path
                const targetPath = path.resolve(process.cwd(), 'public', 'neueSpiele', item.name);
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
                        var savedObj = neueSpieleDao.create(fileObj.fileName, fileObj.fileSize, fileObj.fileMimeType, 'neueSpiele/' + fileObj.fileName, helper.getNow());
                        console.log('Service neueSpiele: Record inserted in db, id=' + savedObj.id);
                        // transfer file to target folder with target name
                        item.mv(targetPath);
                        // remember status
                        fileObj.fileSaved = true;
                        // set to array
                        savedFiles.push(fileObj);
                    } catch (ex) {
                        console.error('Service neueSpiele: Error creating record. Exception occured: ' + ex.message);
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