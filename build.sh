#!/bin/bash
cd /var/www/sonniesedge-website
git pull
npm run build
cp -ra /var/www/sonniesedge-website/dist/. /var/www/html
