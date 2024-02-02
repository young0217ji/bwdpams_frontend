<template>
  <v-app :class="`${isDarkMode ? 'dark-mode' : lightTheme}`">
    <nuxt />
    <v-footer>
      <span>&copy; 2022. BLWS all rights reserved.</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "landing",
  computed: {
    ...mapState({
      isDarkMode: "isDarkMode",
      lightTheme: "lightTheme",
    }),
  },
};
</script>
