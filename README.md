# Subreddit Streamer

Stream comments from subreddits live.

**Demo built (modified version) using this: [https://www.meme-stonks.com](https://www.meme-stonks.com)**

This version is a somewhat cleaned up version of the one used on meme-stonks.com, and it was originally created to cater to live comments from /r/wallstreetbets only. I have remove a lot of code specific to this, but there may still be some code lying around that has no affect on any other subreddit other than /r/wallstreetbets.

### Build and Deploy code included

You can also build and deploy locally via npm. Please see the deploy folder for more information. The build/deploy scripts are called in the root folder via `npm run build` and `npm run deploy` or combined to build -> then deploy: `npm run bd`

The build script packages everything into a `dist.zip` file.

The deploy script will upload this `dist.zip` and execute the `deploy.sh` (located in `/deploy`). The `deploy.sh` script will delete everything in the directory it exists in (except the script itself, and the `dist.zip` file), and unzip the `dist.zip` file. Afterwards it will remove the `dist.zip` file.

I have also included `.htaccess` within the public folder as I use Apache.

### OAuth code included (PHP)

I've included the OAuth code (PHP) -> located in `public/oauth/oauth.php`. In order to use this, you will need to update the fields in `oauth.php`:

- `$allowed_domains`
- `$client`
- `$secret`
- `your.local.domain` strings

You will need to also update the fields in the `.env` files with your Reddit app client IDs (might be best to set up one app for local development, and one for production).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production, also creates a dist.zip archive of the build
```
npm run build
```

### Will upload and deploy the dist.zip to your server (see deploy/README.md for more info)
```
npm run deploy
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
