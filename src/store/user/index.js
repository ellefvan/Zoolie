import * as firebase from 'firebase'

// export a Javascript object
export default {
  state: {
    // set user to null so that we don't start with a user in our application
    user: null
  },
  mutations: {
    // edit the store's state with mutations
    setUser (state, payload) {
      if (payload === null) {
        state.user = null
      }
      // override the user object saved in state if it is null with the payload
      // only add new user properties if the user object has been instantiated
      if (state.user) {
        for (var key in payload) {
          state.user[key] = payload[key]
        }
      } else {
        state.user = payload
      }
    },
    // You cannot access the state of a vuex module from within another module's mutation.
    assignUserBooktoRead (state, payload) {
      const bookData = payload.bookData
      // must check if object has been instantiated,
      // if it hasn't will return error
      if (!state.user[payload.bookArray]) {
        state.user[payload.bookArray] = {}
      }
      state.user[payload.bookArray][payload.fbKey] = bookData
    },
    removeBooktoRead (state, payload) {
      const book = payload.bookKey
      const bookArray = payload.bookArray
      // must check if object has been instantiated, if it hasn't will return error
      if (!state.user[bookArray]) {
        return
      }
      delete state.user[bookArray][book]
    }
  },
  actions: {
    signUserUp ({ commit }, payload) {
      /* the createuserwithemailandpassword method sends data to the firebase server to be validated & will create a new user or
       * give use an error message
       * this method returns a promise which we can call a then on
       * now that we have the mutations, we can use them
       * as soon as we sign the user up, we will set loading to true
       * it is loading regardless of whether the user signup succeeds
       * */
      commit('setLoading', true)
      // if we are making a new request, we want to clear the error in case there has been one saved
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
        // we get user as a returned value so save it in our store via mutations
        user => {
          // once we reach the then block, we will no longer be loading
          commit('setLoading', false)
          // uid is unique id in firebase
          const newUser = {
            id: user.uid,
            fbKeys: {}
          }
          // this object is now is the same format as our state user object & setuser method
          // When a mutation with type setUser is triggered, call this handler & pass it the new user
          commit('setUser', newUser)
        })
        .catch(
          // get the error if the user throws one (password isn't long enough, etc)
          error => {
            // we also want to set loading to false if we got an error
            commit('setLoading', false)
            // if we do get an error, set error to the error
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      // the payload holds our username and password
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
          // we are still creating a new user, even if the user already exists in the database, bc it did not exist in the app before
            user => {
              // set loading to false once we have success
              commit('setLoading', false)
              const newUser = {
                id: user.uid
              }
              commit('setUser', newUser)
            }
        ).catch(error => {
          // set loading to false once we have an error
          commit('setLoading', false)
          // set the error
          commit('setError', error)
          console.log(error)
        })
    },
    autoSignIn ({ commit }, payload) {
      commit('setLoading', true)
      // the payload is an object with a user id on it
      commit('setUser', {id: payload.uid})
      commit('setLoading', false)
    },
    async fetchUserData ({ commit, getters }) {
      commit('setLoading', true)
      /* Create (or reference) a node in the database named users labelled by the user's id
      *  and save all of that user's information (including books) within that node */
      let [wantToReadBooks, readBooks, sharedBooks] = await Promise.all([
        firebase.database().ref('/users/' + getters.user.id + '/wantToReadBooks/')
        .once('value'),
        firebase.database().ref('/users/' + getters.user.id + '/readBooks/').once('value'),
        firebase.database().ref('/users/' + getters.user.id + '/sharedBooks/').once('value')
      ]).catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
      /* when we first add a book to our book list,
      we have to refresh the page to see our updated lists if the objects have not been instantiated
      */
      let wantToReadBooksData = wantToReadBooks.val()
      if (!wantToReadBooksData) wantToReadBooksData = {}
      let readBooksData = readBooks.val()
      if (!readBooksData) readBooksData = {}
      let sharedBooksData = sharedBooks.val()
      if (!sharedBooksData) sharedBooksData = {}
      const updatedUser = {
        id: getters.user.id,
        wantToReadBooks: wantToReadBooksData,
        readBooks: readBooksData,
        sharedBooks: sharedBooksData
      }
      commit('setLoading', false)
      commit('setUser', updatedUser)
    },
    logout ({commit}) {
      // we don't need a payload
      // call firebase's signOut to remove the token from the local storage
      firebase.auth().signOut()
      // clear out the user data from our state
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      // return the user from our VueX store
      return state.user
    }
  }
}
