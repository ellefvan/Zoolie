import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import shared from './shared'
import books from './books'

Vue.use(Vuex)

/** pass an object to the Vuex function
 * VueX documentation: The only way to actually change state in a Vuex store is by committing a mutation.
 * To invoke a mutation handler, you need to call store.commit with its type: store.commit('increment')
 * **/

export const store = new Vuex.Store({
  modules: {
    user,
    shared,
    books
  }
})
