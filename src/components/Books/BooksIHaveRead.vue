<template>
  <v-container fluid>
      <v-layout column align-center>
        <h1>Books I Have Read</h1>
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
            <v-flex v-for="(value, key) in listOfReadBooks" :key="key" md4>
              <v-card class="card">
                <v-btn absolute top right fab dark small color="red" @click="removeBook(key)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-card-media :src="value.imageURL" height="200px">
                </v-card-media>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{ value.title }}</h3>
                    <!-- Vue website: It is recommended to provide a key with v-for whenever possible, unless the iterated DOM content is simple -->
                    <h4 v-for="author in value.authors">{{ author }}</h4>
                    <div>{{ value.subtitle }}</div>
                  </div>
                </v-card-title>
                <v-card-actions >
                  <app-add-comment :bookKey=key :book=value class="button"></app-add-comment>
                  <app-share-book :bookKey=key :book=value></app-share-book>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
  </v-container>
</template>

<style scoped>
  .button {
    margin-right: 10px
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
    listOfReadBooks () {
      return this.$store.getters.getreadbooks
    },
    userIsAuthenticated () {
      // computed property that we call in our computed menuItems to test if user is logged in
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
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
      // call the addBook action we create in our store/books/index.js
      this.$store.dispatch('assignUserBooktoRead',
      {bookData, bookArray: 'readBooks'})
    },
    removeBook (bookFBKey) {
      this.$store.dispatch('removeBook', {bookKey: bookFBKey, bookArray: 'readBooks'})
    }
  }
}
</script>
