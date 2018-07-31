<template>
    <div class="text-xs-center"
      v-if="!userIsAuthenticated">
        <v-dialog
          v-model="dialog"
          width="500"
          persistent
        >
          <v-card>
            <v-card-title
              class="headline blue lighten-5"
              primary-title
            >
              Sign In
            </v-card-title>
            <v-card-text>
              You must sign in or create an account in order to use Zoolie.
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer><v-btn
                color="green"
                flat
                @click="dialog = false"
                to="/SignUp"
              >
                Sign Up
              </v-btn>
              <v-btn
                color="green"
                flat
                @click="dialog = false"
                to="/SignIn"
              >
                Sign In
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
</template>

<script>
  export default {
    props: ['bookKey', 'book'],
    data () {
      return {
        dialog: true
      }
    }
  }
</script>