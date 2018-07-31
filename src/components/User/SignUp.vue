<template>
  <!-- VContainer allows us to use the grid -->
  <v-container>
    <!-- show section only if error from computed values (sourced from the store/index.js's getters) is true -->
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm-3>
        <!-- @dismissed refers to the emit(dismissed) in the Alert.vue file 
        by doing it this way, Alert.vue is a dumb component & doesn't know what it is being used for
        we can then handle the dismissed function within this Signup.vue file where we know what we are using it for

        error is either null (in which case this row would not be executed) or it is an object with a message property
        we have to add text to the props in Alert.vue
        -->
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
      <!-- we want to wrap our form in a card -->
    <v-layout row>
    <!-- everything will be wrapped in this vflex element so everything is positioned in the center -->
      <v-flex xs12 sm6 offset-sm-3>
        <v-card>
          <v-card-text>
            <v-container>
              <!-- call prevent to prevent the default -->
              <form @submit.prevent="onSignup">
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
                  <v-flex xs12>
                    <!-- we will set up our own validation for this field
                    vuetify -> components -> text fields -? rules
                    rules is an array of functions that either must return true or an error message
                    we must bind to rules, because we are passing in a dynamic value to rules
                    -->
                    <v-text-field name="confirmPassword" label="Confirm Password" id="confirmPassword" v-model="confirmPassword"
                                  type="confirmPassword" :rules="[comparePasswords]">
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <!-- we want the button disabled if the loading state is true 
                  :loading is a property made available by the v-button element & "loading" is our state loading 
                  we import our state loading in the computed properties in this vue file -->
                  <v-btn type="submit" :disabled="loading" :loading="loading">Sign Up  
                  <!-- add a button from Vuetify that shows the page is loading when you click on it 
                  the custom-loader class is copied from the css on the Vuetify element; bc we want spinning loader
                  buttons in a couple of components, we will add the css to our stylus/main.styl  -->
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
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
        password: '',
        confirmPassword: ''
      }
    },
    computed: {
      comparePasswords () {
        // this.password refers to our password from our exported data
        // if the passwords don't match, return message otherwise return empty string
        return this.password !== this.confirmPassword ? 'Passwords do not match' : true
      },
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
      onSignup () {
        // confirm that our app works
        console.log({email: this.email, password: this.password, confirmPassword: this.confirmPassword})
        // use Vuex to reach out to firebase & create a new user & store the new user in our VueX app store
        // reach out to the store and call dispatch on the signUserUp method we created
        // Actions are triggered with the store.dispatch method
        // we need to pass in the payload object containing our user data
        // this.email & this.password refers to the email and password in our data object above
        this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
      },
      onDismissed () {
        // clear the error if we click on the x
        this.$store.dispatch('clearError')
        console.log('Dismissed Alert!')
      }
    }
  }
</script>
