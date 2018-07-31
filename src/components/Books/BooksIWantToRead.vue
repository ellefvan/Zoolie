<template>
  <v-container fluid>
      <v-layout column align-center>
        <h1>Books I Want to Read</h1>
      </v-layout>
      <v-layout column align-center v-if="userIsAuthenticated">
        <label for="myBrowser">Type in book title to add to your list:</label>
        <input class="white" v-model="search" placeholder="name" list="browsers" id="myBrowser" name="myBrowser" @change="onSelectedBook" />
        <datalist id="browsers">
          <option v-for="book in filteredBooks" :key="book.id">{{ book.volumeInfo.title }}</option>
        </datalist>
        <div></div>
      </v-layout>
      <v-layout>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular
            indeterminate
            class="primary--text"
            :width="7"
            :size="70"
            v-if="loading"></v-progress-circular>
        </v-flex>
      </v-layout>
        <v-container grid-list-sm text-xs-center v-if="!loading">
          <v-layout row wrap>
            <v-flex v-for="(value, key) in listOfToReadBooks" :key="key" xs3>
              <v-card class="card">
                <v-btn absolute top right fab dark small color="red" @click="removeBook(key)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-card-media :src="value.imageURL" height="200px">
                </v-card-media>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{ value.title }}</h3>
                    <h4 v-for="author in value.authors">{{ author }}</h4>
                    <div>{{ value.subtitle }}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn class="checkBtn" flat color="blue" @click="onReadBook(key)">
                    <v-icon class="checkIcon">check</v-icon> Mark as Read
                  </v-btn>
                  <v-btn flat color="blue" @click="openTab(value.buyLink)">Buy</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.checkBtn {
  padding-left: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      search: null,
      bookArray: []
    }
  },
  created () {
    /* if this is eventually changed to loaking every book in the Google API one day,
    we would want to have this code & the computed code combined in a watcher instead
    asynchronous code (such as code that calls an API)
    should be called from a watcher instead of a computed property ~
    "Vue.js tips and tricks with [Vue.js] core team member Chris Fritz" */
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=flowers&filter=free-ebooks`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.bookArray = response.data.items
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  computed: {
    filteredBooks: function () {
      return this.bookArray.filter((book) => { return book.volumeInfo.title.match(this.search) })
    },
    loading () {
      return this.$store.getters.loading
    },
    listOfToReadBooks () {
      return this.$store.getters.bookstoread
    },
    userIsAuthenticated () {
      // computed property that we call in our computed menuItems to test if user is logged in
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    onReadBook (bookFBKey) {
      // call actions using dispatch
      this.$store.dispatch('readBook', bookFBKey)
    },
    onSelectedBook () {
      let selectedBook = this.filteredBooks[0]
      if (!selectedBook) return
      console.log('Book information: ' + JSON.stringify(this.filteredBooks[0]))
      const bookData = {
        title: this.filteredBooks[0].volumeInfo.title,
        imageURL: this.filteredBooks[0].volumeInfo.imageLinks.thumbnail,
        googleBooksId: this.filteredBooks[0].id,
        subtitle: this.filteredBooks[0].volumeInfo.subtitle,
        authors: this.filteredBooks[0].volumeInfo.authors,
        buyLink: this.filteredBooks[0].saleInfo.buyLink
      }
      // call the assignUserBooktoRead action we create in our store/books/index.js
      this.$store.dispatch('assignUserBooktoRead',
      {bookData, bookArray: 'wantToReadBooks'})
    },
    openTab (link) {
      window.open(link, '_blank')
    },
    removeBook (bookFBKey) {
      this.$store.dispatch('removeBook', {bookKey: bookFBKey, bookArray: 'wantToReadBooks'})
    }
  },
  name: 'BookKeeper'
}
</script>
