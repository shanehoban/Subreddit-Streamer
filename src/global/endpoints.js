// See the .env files for details on which endpoints are used for each build
console.log(process.env.VUE_APP_BUILD_MODE + ' API endpoints loaded')

let isProduction = process.env.VUE_APP_BUILD_MODE === 'production'

module.exports = {
  subreddit: (subreddit = 'askreddit') => {
    return 'https://www.reddit.com/r/' + subreddit + '/comments/.json?'
  },

  threads: (subreddit = 'askreddit') => {
    return 'https://www.reddit.com/r/' + subreddit + '/.json?'
  },

  oAuth: isProduction ? 'https://your.prod.domain/oauth/oauth.php' : 'http://your.local.domain/path/to/oauth.php'
}
