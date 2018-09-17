import fetch from 'isomorphic-fetch';
import fs from 'fs';
import unzip from 'adm-zip';
import mv from  'mv';
import path from 'path';

var tmpZipFile = 'tmpdropboxdata.zip';
var tmpExtractionDir = './tmp';

function plugin(options, callback) {
    try {
        if (!process.env.DROPBOXTOKEN) {
            throw new Error('No Dropbox token specified.');
        } else {
            var Dropbox = require('dropbox').Dropbox;
            var dbx = new Dropbox({ accessToken: process.env.DROPBOXTOKEN, fetch: fetch });
            dbx.filesDownloadZip({path: options.dropboxfolder})
            .then((result) => {
                fs.writeFile(tmpZipFile, result.fileBinary, 'binary', (err) => {
                    let zip = new unzip(tmpZipFile);

                    var zipEntries = zip.getEntries();
                    zip.extractAllTo(tmpExtractionDir);

                    let tmpExtractionSubDir = fs.readdirSync(tmpExtractionDir)[0];

                    mv(path.join(tmpExtractionDir, tmpExtractionSubDir), options.localDestination, {mkdirp: true}, function(err) {
                        callback();
                    });
                });
            })
        }
    }
    catch (err) {
        console.log('Dropbox error: ', err);
    }
}

export default plugin;