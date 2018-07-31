// export a Javascript object
export default {
  state: {
    // initially, we are not loading & we have no authError
    loading: false,
    error: null
  },
  mutations: {
    setLoading (state, payload) {
      // create a mutation to edit the loading state
      // the payload will be set to true or false depending on whether or not we are loading
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      // we could just pass a payload of null into setEror, but this is more explicit
      state.error = null
    }
  },
  actions: {
    clearError ({ commit }) {
      /* if we only have clearError as a mutation and not an action we will get an error in the console
        that it is not recognized we did not have to add setError as an action,
        bc we are committing it as a part of other actions */
      commit('clearError')
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
}
