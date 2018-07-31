import * as firebase from 'firebase'

// export a Javascript object
export default {
  state: {},
  mutations: {},
  actions: {
    addBookToList ({rootState, commit}, payload) {
      commit('setLoading', true)
      let bookArray = payload.bookArray
      let bookData = payload.bookData
      // refer to a node in the firebase database to save data in,
      // doesn't matter if it already exists
      firebase.database().ref('/users/' + rootState.user.user.id)
      // use string interpolation to dynamically access the database's child node
      .child(`/${bookArray}/`)
        .push(bookData)
        .then(data => {
          // call the mutation assignUserBooktoRead with commit
          commit('assignUserBooktoRead',
          /* Firebase will automatically create a unique firebase key
          we will not see data.key if we console data,
          because the object return is a special object by firebase:
          a promisable object
          */
          {bookData, fbKey: data.key, bookArray})
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    assignUserBooktoRead ({rootState, commit, dispatch}, payload) {
      commit('setLoading', true)
      // use Regex to replace any non-text in our input or exit the function
      let bookArray = payload.bookArray
      // escape the action if we did not find the payload's "bookArray"
      if (bookArray === null) return
      // escape the function if the book is already in the bookstoRead array
      for (let key in rootState.user.user[bookArray]) {
        if (rootState.user.user[bookArray][key].googleBooksId === payload.bookData.googleBooksId) {
          console.log('book has already been selected')
          commit('setLoading', false)
          return
        }
      }
      /* we do not necessarily have to map out readbook this way
      and could just set it equal to payload as in the mutations function;
      * but the payload may contain other properties that we don't need
       */
      let updateObj = {
        googleBooksId: payload.bookData.googleBooksId
      }
      if (payload.bookData.title) {
        updateObj.title = payload.bookData.title
      }
      if (payload.bookData.subtitle) {
        updateObj.subtitle = payload.bookData.subtitle
      }
      if (payload.bookData.authors) {
        updateObj.authors = payload.bookData.authors
      }
      if (payload.bookData.imageURL) {
        updateObj.imageURL = payload.bookData.imageURL
      }
      if (payload.bookData.buyLink) {
        updateObj.buyLink = payload.bookData.buyLink
      }
      commit('setLoading', false)
      dispatch('addBookToList', {bookData: updateObj, bookArray})
    },
    readBook ({dispatch, rootState}, payload) {
      // delete the book first, so that we can break if the book was already read
      const readBook = rootState.user.user.wantToReadBooks[payload]
      dispatch('removeBook', {bookKey: payload, bookArray: 'wantToReadBooks'})
      // call assignUserBooktoRead so that we can reuse code!
      dispatch('assignUserBooktoRead',
      // pass in the same payload as we do in the components
      {bookData: readBook, bookArray: 'readBooks'})
    },
    removeBook ({commit, getters}, payload) {
      // Properties in the context object: https://vuex.vuejs.org/api/#actions
      commit('setLoading', true)
      // state references local state and rootState should be used when accessing the state of other modules:
      // https://vuex.vuejs.org/guide/modules.html
      firebase.database().ref('/users/' + getters.user.id).child(`/${payload.bookArray}/` + payload.bookKey)
      .remove()
        .then((data) => {
          commit('setLoading', false)
          commit('removeBooktoRead', {bookKey: payload.bookKey, bookArray: payload.bookArray})
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    saveComment ({commit, getters}, payload) {
      commit('setLoading', true)
      const updateObj = {
        comment: payload.comment
      }
      firebase.database().ref('/users/' + getters.user.id)
      .child('/readBooks/' + payload.bookId)
      // Update some of the keys for a defined path without replacing all of the data
      // https://firebase.google.com/docs/database/admin/save-data#section-update
      .update(updateObj)
        .then((data) => {
          commit('setLoading', false)
          // commit('removeBooktoRead', {bookObject: payload})
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', false)
        })
      commit('setLoading', false)
    },
    shareBook ({dispatch, getters}, payload) {
      let book = getters.getreadbooks[payload.bookKey]
      dispatch('addBookToList',
      {bookData: book, bookArray: 'sharedBooks'})
    }
  },
  getters: {
    bookstoread (state, getters, rootState) {
      // inside module getters, rootState will be exposed as their 3rd argument:
      // https://vuex.vuejs.org/guide/modules.html#module-local-state
      // Return if there is no user object registered
      if (!rootState.user.user) {
        return
      }
      return rootState.user.user.wantToReadBooks
    },
    getreadbooks (state, getters, rootState) {
      // Return if there is no user object registered
      if (!rootState.user.user) {
        return
      }
      return rootState.user.user.readBooks
    },
    getSharedBooks (state, getters, rootState) {
      // Return if there is no user object registered
      if (!rootState.user.user) {
        return
      }
      return rootState.user.user.sharedBooks
    }
  }
}
