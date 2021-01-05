  // This file could contain a whole load of functions and API calls etc...
  // ... or you may want to create several API files if you have several object types and want to keep everything clean and separated
  
  import axios from 'axios'
  import store from '@/store'
  import endpoints from './endpoints'
  import { debugEnabled, throwError } from './helpers'
  
  // gets or refreshes access token
  const getAccessToken = (state = false, code = false) => {
    let refreshToken = store.getters['Auth/getField']('auth.refresh_token') || false

    if (refreshToken || state === store.getters['Settings/getField']('settings.uid')) {
      let data = new FormData()
      data.append('grant_type', refreshToken ? 'refresh_token' : 'authorization_code')

      if (refreshToken) {
        debugEnabled() && console.log('refreshing token', refreshToken)
        data.append('refresh_token', refreshToken)
      } else {
        debugEnabled() && console.log('getting new token')
        data.append('code', code)
        data.append('redirect_uri', process.env.VUE_APP_AUTH_URI)
      }

      debugEnabled() && console.log('store:', store)
      debugEnabled() && console.log('refreshToken:', refreshToken)
      debugEnabled() && console.log('form data:', data)

      return axios.post(endpoints.oAuth, data)
      .then((response) => {
        if(response.status === 200) {
          debugEnabled() && console.log('auth data', response.data)

          if (response.data.error) {
            throwError('auth error', response.data.error)
            return {
              success: false,
              message: response.data.error
            }
          } else {
            // all gucci
            store.commit('Auth/SET_AUTH', response.data)
            return {
              success: true,
              message: 'done'
            }
          }
        } else {
          throwError('auth something went wrong', response)
          return {
            success: false,
            message: response
          }
        }
      }).catch((error) => {
        // Error 😨
        throwError('auth error', error)
        return {
          success: false,
          message: error
        }
      })
    } else {
      throwError('states mismatch')
      return {
        success: false,
        message: 'states mismatch'
      }
    }
  } // end get access token

  export default { 
    getAccessToken,
  }