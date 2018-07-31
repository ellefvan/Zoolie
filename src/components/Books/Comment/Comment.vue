<template>
    <v-dialog v-model="dialog" width="600px">
        <v-btn slot="activator" color="blue" dark><v-icon>comment</v-icon> Comment</v-btn>
        <v-card>
            <v-card-title>
                <span class="headline">Review your book?</span>
            </v-card-title>
            <v-card-text>
                <v-textarea
                name="description"
                label="Description"
                placeholder="This book was great. The best I ever read!"
                id="description"
                outline
                v-model="comment"
                required></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat="flat" @click="dialog = false">Close</v-btn>
                <v-btn color="green darken-1" flat="flat" @click="onSaveChanges">Save</v-btn>
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
        dialog: false,
        comment: this.book.comment
      }
    },
    methods: {
      onSaveChanges () {
        // don't actually save if the user didn't type anything
        if (this.comment.trim() === '') {
          return
        }
        this.dialog = false
        this.$store.dispatch('saveComment',
        {bookId: this.bookKey, comment: this.comment})
      }
    }
  }
</script>