const fs = require('fs')

let sftp = require('ssh2-sftp-client')
let client = new sftp()

const { Client } = require('ssh2')

const host = 'YOUR_LIVE_HOST_IP'
const port = 'YOUR_LIVE_HOST_PORT'
const username = 'YOUR_LIVE_HOST_USERNAME'
const privateKey = fs.readFileSync(__dirname + '/YOUR_PRIVATE_KEY.ppk')
const remoteDirectory = 'REMOTE_DIRECTORY_TO_DEPLOY_TO' // e.g. /var/www/my-cool-domain

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// you should not need to edit below this line if you have uploaded the deploy.sh script to the remote directory ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.connect({
  host: host,
  port: port,
  username: username,
  privateKey: privateKey
})
.then(() => {
  let localDistFolder = fs.createReadStream(__dirname + '/dist.zip');
  let remoteLocation = remoteDirectory + '/dist.zip';
  
  console.log('Uploading zip...')

  return client.put(localDistFolder, remoteLocation);
})
.then(() => {
  // second ssh to execute the script (stupid I know)
  const conn = new Client();

  conn.on('ready', () => {
    console.log('Client :: ready')
    
    let execCommand = 'cd ' + remoteDirectory + ' && ./deploy.sh' // make sure you have the deploy.sh script in the remote directory
    
    conn.exec(execCommand, (err, stream) => {
      if (err) {
        throw err
      }

      stream.on('close', (code, signal) => {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal)
        conn.end()
      }).on('data', (data) => {
        console.log('STDOUT: ' + data)
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data)
      })
    })
  }).connect({
    host: host,
    port: port,
    username: username,
    privateKey: privateKey
  })
})
.then(() => {
  return client.end();
})
.catch(err => {
  console.log(err, 'catch error');
})