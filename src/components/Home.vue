<template>
  <v-container fluid>
      <app-force-login v-if="!userIsAuthenticated" />
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <h1>My Feed</h1>
        People with the same interests as you:
        <v-layout wrap align-center spacer>
          <v-avatar color="indigo">
            <v-icon dark="">account_circle</v-icon>
          </v-avatar>
          <v-avatar>
            <img src="/static/images/john.jpg" alt="John">
          </v-avatar>
            <v-avatar
              color="purple red--after">
              <v-icon dark="">notifications</v-icon>
            </v-avatar>
          <v-avatar color="teal">
            <span class="white--text headline">C</span>
          </v-avatar>
          <v-avatar color="red">
            <span class="white--text headline">J</span>
          </v-avatar>
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
        <v-container grid-list-md text-xs-center v-if="!loading">
          <v-layout row wrap>
            <v-flex v-for="book in bookArray" :key="book.id" md3  v-if="!userIsAuthenticated">
              <v-card>
                <v-card-media :src="book.volumeInfo.thumbnail" height="200px">
                </v-card-media>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{ book.volumeInfo.title }}</h3>
                    <h4 v-for="author in book.volumeInfo.authors">{{ author }}</h4>
                    <div>{{ book.volumeInfo.description }}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat color="blue">Test</v-btn>
                  <v-btn flat color="blue" @click="openTab(book.buyLink)">Buy</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex v-for="(value, key) in sharedBooks" :key="key" md3  v-if="userIsAuthenticated">
              <v-card class="card">
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
                <v-card-actions>
                  <v-btn flat color="blue">Blank</v-btn>
                  <v-btn flat color="blue" @click="openTab(value.buyLink)">Buy</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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
export default {
  data () {
    return {
      bookArray: [{
        'id': '1eeee',
        'volumeInfo': {
          'title': 'The Last Song',
          'authors': [
            'Nicholas Sparks'
          ],
          'description': 'Dummy description',
          'thumbnail': '/static/images/TheLastSong.jpg'
        },
        'buyLink': 'https://play.google.com/store/books/details?id=2-SeHlvtIXkC&rdid=book-2-SeHlvtIXkC&rdot=1&source=gbs_atb&pcampaignid=books_booksearch_atb'
      }]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    sharedBooks () {
      return this.$store.getters.getSharedBooks
    },
    userIsAuthenticated () {
      // computed property that we call in our computed menuItems to test if user is logged in
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    openTab (link) {
      window.open(link, '_blank')
    }
  }
}
</script>
