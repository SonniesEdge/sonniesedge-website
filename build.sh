#!/bin/bash
cd /var/www/sonniesedge-website
npm run build
cp -ra ./dist/. /var/www/html
