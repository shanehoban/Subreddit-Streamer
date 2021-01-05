## Prerequisites

Upload the `deploy.sh` to your remote directory where you want to deploy your build. This script simply removes everything in the directory and unzips the uploaded zip file.

If in doubt then **do not use this** -> maybe just manually upload/deploy.

## To use:

- Upload the `deploy.sh` to your remote directory where you want to deploy your build. This script simply removes everything in the directory and unzips the uploaded zip file.
- Update deploy.js
     - There are a couple of fields that need to be updated, please browse this file and update as needed
     - This is set up for HTTPS only as every site should now have HTTPS as it's free via lets encrypt
- `Archive.js` does not need to be updated/changed