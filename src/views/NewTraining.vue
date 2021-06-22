<template>
  <v-container>
    <Header></Header>
    <v-text-field
      v-model="object.title"
      label="Titre de l'entraînement"
    ></v-text-field>
    <v-textarea v-model="object.description" label="Description"></v-textarea>
    <div>
      Exercices :
      <v-row><v-col> </v-col></v-row>
    </div>
  </v-container>
</template>

<script>
import Header from "../components/Header.vue";
import firebase from "firebase/app";
export default {
  components: {
    Header: Header,
  },
  data() {
    return {
      object: {
        title: "",
        description: "",
      },
      exercises: null,
    };
  },
  mounted() {
    if (!this.$store.state.uid) return this.$router.push({ name: "Login" });
    const db = firebase.firestore();
    db.collection("exercises")
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot);
        this.exercises = querySnapshot;
      });
  },
};
</script>

<style>
</style>