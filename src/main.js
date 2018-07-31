import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import * as firebase from 'firebase'

// make the Alert component a global component
import AlertCmp from './components/Shared/Alert.vue'
import CommentCmp from './components/Books/Comment/Comment.vue'
import ShareCmp from './components/Books/Comment/Share.vue'
import LogInCmp from './components/Shared/LogIn.vue'

// register the alert component
// use this name when importing the components within Vue files
Vue.component('app-alert', AlertCmp)
Vue.component('app-add-comment', CommentCmp)
Vue.component('app-share-book', ShareCmp)
Vue.component('app-force-login', LogInCmp)

Vue.use(Vuetify, {
  theme: {
    primary: '#000',
    secondary: '#3F51B5',
    accent: '#673AB7',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#2196f3',
    success: '#4caf50'
  }})

Vue.config.productionTip = false

// call ESLint no-new rule, bc other wise it will throw an error if the new object is not saved to a variable
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      /* no one can login to our account with just an apiKey, they will also need our username & password
      but they can still use it in their own app.. to avoid this whitelist your own ip adresses, etc.
      on the Firebase API console
      If your server side code provider does not have this capability, you can wrap tokens in server
      side code in an AWS lambda function or NodeJS/PHP code, etc...
      */
      apiKey: 'AIzaSyAh-zQ9BiBxOVQDfRBrum21lbdiehzHTbc',
      authDomain: 'freetimekeeper-206719.firebaseapp.com',
      databaseURL: 'https://freetimekeeper-206719.firebaseio.com',
      projectId: 'freetimekeeper-206719',
      storageBucket: 'freetimekeeper-206719.appspot.com'
    })
    // if the user already has their login stored in local storage, automatically sign them in
    firebase.auth().onAuthStateChanged((user) => {
      // this will also be called on logout, but then the user would be null
      if (user) {
        // call autoSignIn that we create in our store/index.js file
        // pass in user as the payload
        this.$store.dispatch('autoSignIn', user)
        // fetchUserData doesn't require a payload to be passed
        this.$store.dispatch('fetchUserData')
      }
    })
  }
})
