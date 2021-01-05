<?php 
  $origin = $_SERVER['HTTP_ORIGIN'];
  $allowed_domains = [
    'http://your.local.domain:1337',
    
    'https://your.prod.domain.com',
    'https://www.your.prod.domain.com',
  ];

  $response = ['error' => 'no way josé'];

  if (in_array($origin, $allowed_domains)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    $code = (!empty($_POST['code']) && isset($_POST['code'])) ? $_POST['code'] : false;
    $redirect_uri = (!empty($_POST['redirect_uri']) && isset($_POST['redirect_uri'])) ? $_POST['redirect_uri'] : false;
    $grant_type = (!empty($_POST['grant_type']) && isset($_POST['grant_type'])) ? $_POST['grant_type'] : false;
    $refresh_token = (!empty($_POST['refresh_token']) && isset($_POST['refresh_token'])) ? $_POST['refresh_token'] : false;

    if ($grant_type) {
      $data = [];
      $error = false;
      $data['grant_type'] = $grant_type;

      if ($grant_type === 'authorization_code' && $code && $redirect_uri) {
        $data['code'] = $code;
        $data['redirect_uri'] = $redirect_uri;
      } else if ($grant_type === 'refresh_token' && $refresh_token) {
        $data['refresh_token'] = $refresh_token;
      } else {
        $error = true;
      }

      if (!$error) {
      
        $client = strpos($origin, 'your.local.domain:1337') ? 'YOUR_LOCAL_REDDIT_CLIENT_ID' : 'YOUR_PROD_REDDIT_CLIENT_ID';
        $secret = strpos($origin, 'your.local.domain:1337') ? 'YOUR_LOCAL_REDDIT_CLIENT_SECRET' : 'YOUR_PROD_REDDIT_CLIENT_SECRET';

        $url = 'https://www.reddit.com/api/v1/access_token';
        
        // use key 'http' even if you send the request to https://...
        $options = array(
          'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\nAuthorization: Basic " . base64_encode("$client:$secret"),
            'method'  => 'POST',
            'content' => http_build_query($data)
          )
        );
        
        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        
        if ($result === FALSE) {
          $response = ['error' => 'something wrong josé'];
        } else {
          $response = json_decode($result);
        }
      } else {
        $response = ['error' => 'error in parameters josé'];
      }
    } else {
      $response = ['error' => 'no grant type josé'];
    }
  } // end if origins are allowed

  echo json_encode($response);
  exit;
