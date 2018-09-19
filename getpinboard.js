import Pinboard from 'node-pinboard';
import expandTilde from 'expand-tilde';
import fs from 'fs';
import outdent from 'outdent';
import path from 'path';
import slug from 'slug';

import fetch from 'isomorphic-fetch';
import {Dropbox} from 'dropbox';

var api_token = process.env.PINBOARDTOKEN;
var pinboard = new Pinboard(api_token);

var env = process.env.NODE_ENV || 'dev';

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

function formatFile(time, href, description, extended, tags) {
    let tagArray = tags.split(" ");
    let tagString = '';
    for (let index = 0; index < tagArray.length; index++) {
        tagString += '- ' + tagArray[index];
        if (index !== tagArray.length - 1) {
            tagString += '\n';
        }
    }

    let data = outdent`
    ---
    date: ${time}
    link: ${href}
    tags: 
    ${tagString}
    title: ${description}
    ---
    ${extended}
    `;

    return data;
}

function getPinboard(options, callback) {

    let uploadArray = [];
    pinboard.recent({tag: 'web'}, function(err, res) {
        if (res.posts.length > 0) {
            res.posts.forEach(entry => {
                if (entry.shared === 'yes') {
                    let uploadObj = {};
                    let filename = slug(entry.href);
                    uploadObj.content = formatFile(entry.time, entry.href, entry.description, entry.extended, entry.tags);
                    uploadObj.filename = `${filename}.md`;
                    uploadArray.push(uploadObj);
                }
            });        


            if (env === 'dev') {
                _writeToLocalDropbox(uploadArray, options.path, callback); 
            } else {
                _uploadArrayToDropbox(uploadArray, options.path, callback); 
            }

        } else {
            console.log('Nothing found from Pinboard API!');
            callback();
        }
    });
}

function _writeToLocalDropbox(files, saveLocation, callback) {
    if (Object.keys(files).length > 0) {
        files.forEach(file => {
            let fullPath = path.join(getDropboxPath(), saveLocation, file.filename);
            // console.log(fullPath);
            fs.writeFileSync(fullPath, file.content, {encoding: 'utf8'});
        });
    }

    callback();
}

function _uploadArrayToDropbox(files, saveLocation, callback) {

    if (!process.env.DROPBOXTOKEN) {
        throw new Error('No Dropbox token specified.');
    } else {
        var dbx = new Dropbox({
            accessToken: process.env.DROPBOXTOKEN, 
            fetch: fetch 
        });

        files.forEach(file => {
            let filePath = path.join(saveLocation, file.filename);
            dbx.filesUpload({ path: filePath, contents: file.content})
            .then(function (response) {
                console.log('Bookmark created in Dropbox: ', filePath);
                // console.log(response);
            })
            .catch(function (err) {
              console.log(err);
            });
        });

        callback();
    
    }
}

export default getPinboard;