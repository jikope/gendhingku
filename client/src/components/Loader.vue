<template>
  <v-overlay :value="overlay" :z-index="zIndex">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>
<script>
export default {
  data: () => ({
    overlay: false,
    zIndex: 203, // Dialog z-index is 202
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
