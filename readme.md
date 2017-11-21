# sonniesedge-website

## On the server

Make git use the custom hook path.

`git config core.hooksPath hooks`

Set this as a production environment, so the build scripts will be run.

`export PROD="true"`

Add a cron job to run `cron.sh` every 5 minutes.

`*/5 * * * * /var/www/sonniesedge-websites/cron.sh`
