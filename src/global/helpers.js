  // This file could contain a whole load of functions and API calls etc...
  // ... or you may want to create several API files if you have several object types and want to keep everything clean and separated
  
  import store from '@/store'

  export const getTimestamp = (timestamp) => {
    let date = new Date((parseFloat(timestamp)*1000))

    return date.toLocaleString()
  }
  
  export const deepCopy = (object) => {
    return JSON.parse(JSON.stringify(object)) || false
  }

  export const validEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  export const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight)
  }

  import { Notyf } from 'notyf'

  const notyf = new Notyf({
    duration: 4000,
    ripple: false,
    icon: false,
    types: [
      {
        type: 'primary',
        className: 'toast-primary',
        icon: false,
      },
      {
        type: 'success',
        className: 'toast-success',
        icon: false,
      },
      {
        type: 'danger',
        className: 'toast-danger',
        icon: false,
      },
    ],
  })

  export const toast = (message, type = 'primary') => {
    notyf.open({
      type,
      message,
    })
  }

  export const debugEnabled = () => {
    return store.getters['Settings/getField']('settings.debug') 
      && !store.getters['Settings/getField']('settings.disableConsoleLogs')
  }

  export const throwError = (msg, payload = false, disableToast = false) => {
    !disableToast && toast(msg, 'danger')
    debugEnabled() && console.error(msg || 'error', (payload) ? payload : '')
    if (payload === 'invalid_grant') { console.warn('the code has expired or already been used') }
    if (payload === 'invalid parameters josé') { console.warn('wrong params') }
  }

  export const getAuthURL = () => {
    return 'https://www.reddit.com/api/v1/authorize?client_id=' + process.env.VUE_APP_REDDIT_CLIENT_ID
            + '&response_type=code'
            + '&state=' + store.getters['Settings/getField']('settings.uid')
            + '&redirect_uri=' +  process.env.VUE_APP_AUTH_URI
            + '&duration=permanent'
            + '&scope=submit%20vote'
  }

  export default {
    getTimestamp,
    deepCopy,
    validEmail,
    scrollToBottom,
    debugEnabled,
    throwError,
    toast,
    getAuthURL
  }