<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12"
        ><router-link :to="{ name: 'Settings' }">
          <v-btn>Mon compte</v-btn>
        </router-link></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",

  mounted() {
    if (!this.$store.state.uid) return this.$router.push({ name: "Login" });
  },
};
</script>
