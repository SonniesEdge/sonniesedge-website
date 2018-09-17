import fetch from 'isomorphic-fetch';
import fs from 'fs';
import unzip from 'adm-zip';
import mv from  'mv';
import path from 'path';
import copy from 'copy';
import expandTilde from 'expand-tilde';
import {Dropbox} from 'dropbox';

var tmpZipFile = 'tmpdropboxdata.zip';
var tmpExtractionDir = './tmp';

function getDropboxPath() {
    try {
        let infoFile = expandTilde('~/.dropbox/info.json');
        let data = fs.readFileSync(infoFile);
        let parsedData = JSON.parse(data);

        return parsedData.personal.path;
    }
    catch (err) {
        console.log('{Path} error: ', err);
    }
}

function copyDropboxFiles(options, callback) {
    if (!process.env.DROPBOXTOKEN) {
        throw new Error('No Dropbox token specified.');
    } else {

        var env = process.env.NODE_ENV || 'dev';

        if (env === 'dev') {
            console.log('Dev env');
            // Combine paths
            let dropboxFullPath = path.join(getDropboxPath(), options.dropboxfolder);

            // Copy files on local filesystem
            copy(dropboxFullPath + '/**', options.localDestination, function(err, files) {
                if (err) throw err;
                callback();
            });
            
        } else {
            console.log('Prod env');
            
            var dbx = new Dropbox({ accessToken: process.env.DROPBOXTOKEN, fetch: fetch });
            dbx.filesDownloadZip({path: options.dropboxfolder})
            .then((result) => {
                console.log('Got zip file from dropbox');
                fs.writeFile(tmpZipFile, result.fileBinary, 'binary', (err) => {
                    console.log('Writing zip file');
                    let zip = new unzip(tmpZipFile);

                    var zipEntries = zip.getEntries();
                    zip.extractAllTo(tmpExtractionDir);

                    let tmpExtractionSubDir = fs.readdirSync(tmpExtractionDir)[0];

                    mv(path.join(tmpExtractionDir, tmpExtractionSubDir), options.localDestination, {mkdirp: true}, function(err) {
                        callback();
                    });
                });
            })
            .catch(function (err) {
                throw new Error('Dropbox failed with error: ', err);
            });
        }
    }
}

export default copyDropboxFiles;