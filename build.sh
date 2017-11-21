#!/bin/bash
npm run build
cp -ra ./dist/. /var/www/html
