import fetch from 'isomorphic-fetch';
import fs from 'fs';
import unzip from 'adm-zip';

var tmpZip = 'tmpdropboxdata.zip';

function plugin(options) {
    try {
        if (!process.env.DROPBOXTOKEN) {
            throw new Error('No Dropbox token specified.');
        } else {
            var Dropbox = require('dropbox').Dropbox;
            var dbx = new Dropbox({ accessToken: process.env.DROPBOXTOKEN, fetch: fetch });
            dbx.filesDownloadZip({path: options.dropboxfolder})
            .then((result) => {
                fs.writeFile(tmpZip, result.fileBinary, 'binary', (err) => {
                    console.log('Got ' + options.dropboxfolder);
                    // fs.createReadStream(tmpZip).pipe(unzip.Extract({ path: options.localDestination }));
                    let zip = new unzip(tmpZip);
                    zip.extractAllTo(options.localDestination, true);
                    return true;
                });
            })
        }
    }
    catch (err) {
        console.log('Dropbox error: ', err);
    }
}

export default plugin;