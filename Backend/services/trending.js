const helper = require('../helper.js');
const fileHelper = require('../fileHelper.js');
const path = require('path');
const TrendingDao = require('../dao/trendingDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service trending');

serviceRouter.get('/trending/gib/:spiele_id', function (request, response) {
    console.log('Service trending: Client requested one record, spiele_id=' + request.params.spiele_id);

    const trendingDao = new TrendingDao(request.app.locals.dbConnection);
    try {
        var obj = trendingDao.loadById(request.params.spiele_id);
        console.log('Service trending: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service trending: Error loading record by spiele_id. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.get('/trending/alle', function (request, response) {
    console.log('Service Spiele: Client requested all records');

    const trendingDao = new TrendingDao(request.app.locals.dbConnection);
    try {
        var arr = trendingDao.loadAll();
        console.log('Service trending: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service trending: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.get('/trending/cover_pfade', function (request, response) {
    console.log('Service Spiele: Client requested all Cover Paths');

    const trendingDao = new TrendingDao(request.app.locals.dbConnection);
    try {
        var arr = trendingDao.loadCoverPfade();
        console.log('Service trending: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service trending: Error loading all Cover Paths. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.get('/trending/existiert/:spiele_id', function (request, response) {
    console.log('Service trending: Client requested check, if record exists, spiele_id=' + request.params.spiele_id);

    const trendingDao = new TrendingDao(request.app.locals.dbConnection);
    try {
        var exists = trendingDao.exists(request.params.spiele_id);
        console.log('Service Spiele: Check if record exists by spiele_id=' + request.params.spiele_id + ', exists=' + exists);
        response.status(200).json({'spiele_id': request.params.spiele_id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Spiele: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.post('/trending', function (request, response) {
    console.log('Service Spiele: Client requested creation of new record');

    var errorMsgs = [];
    if (helper.isUndefined(request.body.spiele_name))
        errorMsgs.push('spiele_name fehlt');
    // TODO Für ALLE Daten


    if (errorMsgs.length > 0) {
        console.log('Service trending: Creation not possible, data missing');
        response.status(400).json({
            'fehler': true,
            'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)
        });
        return;
    }

    const trendingDao = new TrendingDao(request.app.locals.dbConnection);
    try {
        var obj = trendingDao.create(request.body.spiele_name);
        console.log('Service Spiele: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Spiele: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.put('/trending', function (request, response) {
    console.log('Service trending: Client requested update of existing record');

    var errorMsgs = [];
    if (helper.isUndefined(request.body.spiele_name))
        errorMsgs.push('spiele_name fehlt');
    // TODO Für ALLE Daten

    if (errorMsgs.length > 0) {
        console.log('Service trending: Update not possible, data missing');
        response.status(400).json({
            'fehler': true,
            'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs)
        });
        return;
    }

    const trendingDao = new TrendingDao(request.app.locals.dbConnection);
    try {
        var obj = trendingDao.create(request.body.spiele_name);
        console.log('Service trending: Record updated, spiele_id=' + request.body.spiele_id);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service trending: Error updating record by spiele_id. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.delete('/trending/:spiele_id', function (request, response) {
    console.log('Service trending: Client requested deletion of record, spiele_id=' + request.params.spiele_id);

    const trendingDao = new TrendingDao(request.app.locals.dbConnection);
    try {
        var obj = trendingDao.loadById(request.params.spiele_id);
        trendingDao.delete(request.params.spiele_id);
        console.log('Service trending: Deletion of record successfull, spiele_id=' + request.params.spiele_id);
        response.status(200).json({'gelöscht': true, 'eintrag': obj});
    } catch (ex) {
        console.error('Service trendinge: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({'fehler': true, 'nachricht': ex.message});
    }
});

serviceRouter.post('/trending/aufladen', async (request, response) => {
    console.log('Service trending: upload multiple pictures called');
    const trendingDao = new trendingDao(request.app.locals.dbConnection);

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
                const targetPath = path.resolve(process.cwd(), 'public', 'trending', item.name);
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
                        var savedObj = trendingDao.create(fileObj.fileName, fileObj.fileSize, fileObj.fileMimeType, 'trending/' + fileObj.fileName, helper.getNow());
                        console.log('Service trending: Record inserted in db, id=' + savedObj.id);
                        // transfer file to target folder with target name
                        item.mv(targetPath);
                        // remember status
                        fileObj.fileSaved = true;
                        // set to array
                        savedFiles.push(fileObj);
                    } catch (ex) {
                        console.error('Service trending: Error creating record. Exception occured: ' + ex.message);
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