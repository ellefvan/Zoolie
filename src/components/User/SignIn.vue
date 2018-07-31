<template>
  <!-- VContainer allows us to use the grid -->
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm-3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <!-- everything will be wrapped in this vflex element so everything is positioned in the center -->
      <v-flex xs12 sm6 offset-sm-3>
      <!-- we want to wrap our form in a card -->
        <v-card>
          <v-card-text>
            <v-container>
              <!-- call prevent to prevent the default -->
              <form @submit.prevent="onSignin">
                <!-- have a row of the full available width -->
                <v-layout row>
                  <v-flex xs12>
                    <!-- having a type of email will insure that we have an email optimized keyboard on our mobile -->
                    <v-text-field name="email" label="E-Mail" id="email" v-model="email" type="email" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="password" label="Password" id="password" v-model="password" type="password" required>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-btn type="submit" :disabled="loading" :loading="loading">
                    Sign In
                    <span slot="loader" class="custom-loader">
                      <v-icon light="">cached</v-icon>
                    </span>
                  </v-btn>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  /* export our default object for this view component
  e-mail & password should be empty strings initially
  */
  export default {
    data () {
      return {
        email: '',
        password: ''
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      // add a watcher on our vue component instance
      user (value) {
        // if the value isn't null & the value isn't undefined, then we know that we have a user
        if (value !== null && value !== undefined) {
          // redirect to the root after a successful signup
          this.$router.push('/')
        }
      }
    },
    methods: {
      onSignin () {
        // reach out to the store and call dispatch on the signUserIn method we created
        // Actions are triggered with the store.dispatch method
        // we need to pass in the payload object containing our user data
        // this.email & this.password refers to the email and password in our data object above
        this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
      },
      onDismissed () {
        // clear the error if we click on the x
        this.$store.dispatch('clearError')
        console.log('Dismissed Alert!')
      }
    }
  }
</script>
