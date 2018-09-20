import fetch from "isomorphic-fetch";
import fs from "fs";
import unzip from "adm-zip";
import mv from "mv";
import path from "path";
import copy from "copy";
import expandTilde from "expand-tilde";
import { Dropbox } from "dropbox";

var tmpZipFile = "tmpdropboxdata.zip";
var tmpExtractionDir = "./tmp";

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function getDropboxPath() {
  try {
    let infoFile = expandTilde("~/.dropbox/info.json");
    let data = fs.readFileSync(infoFile);
    let parsedData = JSON.parse(data);

    return parsedData.personal.path;
  } catch (err) {
    console.log("{Path} error: ", err);
  }
}

function copyDropboxFiles(options, callback) {
  if (!process.env.DROPBOXTOKEN) {
    throw new Error("No Dropbox token specified.");
  } else {
    if (fs.existsSync(tmpExtractionDir)) {
      deleteFolderRecursive(tmpExtractionDir);
    }

    var env = process.env.NODE_ENV || "dev";

    if (env === "dev") {
      // Combine paths
      let dropboxFullPath = path.join(getDropboxPath(), options.dropboxfolder);
      console.log("Dev dropbox path: ", dropboxFullPath);

      // Copy files on local filesystem
      copy(dropboxFullPath + "/**", options.localDestination, function(
        err,
        files
      ) {
        if (err) throw err;
        callback();
      });
    } else {
      var dbx = new Dropbox({
        accessToken: process.env.DROPBOXTOKEN,
        fetch: fetch
      });

      dbx
        .filesDownloadZip({
          path: options.dropboxfolder
        })
        .then(result => {
          fs.writeFile(tmpZipFile, result.fileBinary, "binary", err => {
            // Unzip all files to temp dir
            let zip = new unzip(tmpZipFile);
            zip.extractAllTo(tmpExtractionDir);

            fs.readdirSync(tmpExtractionDir).forEach(file => {
              console.log(file);
            });

            // Access files in sole nested folder (grrr Dropbox for this)
            let tmpExtractionSubDir = fs.readdirSync(tmpExtractionDir)[0];
            let fullTmpPath = path.join(tmpExtractionDir, tmpExtractionSubDir);

            // Move files to destination
            mv(
              fullTmpPath,
              options.localDestination,
              { mkdirp: true },
              function(err) {
                callback();
              }
            );
          });
        })
        .catch(function(err) {
          console.log("Dropbox failure!");
          console.log(err);
        });
    }
  }
}

export default copyDropboxFiles;
