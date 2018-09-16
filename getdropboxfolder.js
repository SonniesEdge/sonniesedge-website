import fetch from 'isomorphic-fetch';
import fs from 'fs';
import unzip from 'adm-zip';
import mv from  'mv';
import path from 'path';

var tmpZip = 'tmpdropboxdata.zip';
var tmpDir = './tmp';

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
                    let zip = new unzip(tmpZip);

                    var zipEntries = zip.getEntries();
                    zip.extractAllTo(tmpDir);

                    let tmptmp = fs.readdirSync(tmpDir)[0];
                    console.log(tmptmp);

                    mv(path.join(tmpDir, tmptmp), options.localDestination, {mkdirp: true}, function(err) {
                        console.log('done!');
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