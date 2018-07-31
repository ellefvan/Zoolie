<template>
    <v-dialog v-model="dialog" width="600px">
        <v-btn slot="activator" color="blue" dark><v-icon>thumb_up_alt</v-icon>Share</v-btn>
        <v-card>
            <v-card-title>
                <span class="headline">Share your book?</span>
            </v-card-title>
            <v-card-text>
                Sharing your book will add it to your friends' feed.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat="flat" @click="dialog = false">Close</v-btn>
                <v-btn color="green darken-1" flat="flat" @click="shareBook(bookKey)">Share</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
  textarea {
    resize: none;
    padding: 10px;
    width: 100%;
    border: gray 1px solid;
  }
</style>

<script>
  export default {
    props: ['bookKey', 'book'],
    data () {
      return {
        dialog: false
      }
    },
    methods: {
      shareBook (bookFBKey) {
        this.$store.dispatch('shareBook', {bookKey: bookFBKey})
      }
    }
  }
</script>