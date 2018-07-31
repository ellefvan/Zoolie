<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile :to="homepageItem.link">
            <v-list-tile-action>
              <v-icon v-html="homepageItem.icon" :color="homepageItem.color"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ homepageItem.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        <v-list-group
          v-if="userIsAuthenticated"
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="item.link"
        >
          <v-list-tile slot="activator">
            <v-list-tile-action>
              <v-icon v-html="item.icon" :color="item.color"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="subItem in item.items" :to="subItem.link" :key="subItem.title">
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>{{ subItem.action }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="white"
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!userIsAuthenticated" >
        <v-btn flat to ="/signup">Sign Up</v-btn>
        <v-btn flat to="/signin">Sign In</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-if="userIsAuthenticated" @click="onLogout">
        <v-btn flat to ="/signin">Log Out</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; Lorelei L. Evans 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: true,
      fixed: false,
      homepageItem: {
        icon: 'bubble_chart',
        title: 'Get Inspired',
        link: '/',
        color: 'light-blue'
      },
      items: [
        {
          icon: 'book',
          title: 'Books',
          color: 'blue',
          items: [
            { title: 'Books I Have Read',
              link: '/booksihaveread'
            },
            { title: 'Books I Want to Read',
              link: '/bookstoread'
            }
          ]
        },
        {
          icon: 'games',
          title: 'Games',
          color: 'grey'
        },
        {
          icon: 'local_movies',
          title: 'Movies',
          color: 'brown'
        },
        {
          icon: 'tv',
          title: 'TV Shows',
          color: 'black'
        }],
      miniVariant: false,
      title: 'Zoolie'
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    userIsAuthenticated () {
      // computed property that we call in our computed menuItems to test if user is logged in
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    onLogout () {
      // call the logout action we create in our store/index.js
      this.$store.dispatch('logout')
    }
  },
  name: 'App'
}
</script>
