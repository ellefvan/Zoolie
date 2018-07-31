<template>
	<!-- the value property controls visibility & we want this to always be true if we are calling this component 
while we could code the value changing to false here, we will just decide whether to show alert or now in the 
components that call Alert -->
	<v-alert error dismissible @input="onClose" :value="true">
		<!-- put text in the alert that is defined in the components that call alert -->
      {{text}}
  </v-alert>
</template>

<script>
  export default {
    props: ['text'],
    methods: {
      onClose () {
        this.$emit('dismissed')
      }
    }
  }
</script>
