<template>
  <v-overlay :value="overlay">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>
<script>
export default {
  data: () => ({
    overlay: false,
  }),
  methods: {
    show() {
      this.overlay = true;
    },
    hide() {
      this.overlay = false;
    },
  },
};
</script>
