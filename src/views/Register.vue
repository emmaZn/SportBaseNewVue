<template>
  <v-container fluid class="bg">
    <v-row justify="center" class="pt-6"> <h1>SPORTBASE</h1></v-row>

    <v-form @submit.prevent="register" class="pt-12 mt-8">
      <v-row justify="center" class="pt-6">
        <h2>Inscription</h2>
      </v-row>
      <v-col class="mx-auto pt-8" cols="3">
        <v-text-field dark type="email" label="Adresse email" v-model="email" />
      </v-col>
      <v-col class="mx-auto" cols="3">
        <v-text-field dark type="password" label="Mot de passe" v-model="password" />
      </v-col>
      <div class="d-flex justify-center pt-8">
        <v-btn min-width="250" color="" type="submit" @click="register">
         Inscription</v-btn>
      </div>
      <div class="d-flex justify-center">
      <router-link :to="{name:'Login'}">
        <v-btn color="primary" min-width="250" class="mt-5">CONNEXION</v-btn>
      </router-link>
    </div>
    </v-form>
    <v-snackbar v-model="snackbar">
      Un e-mail de vérification vient de vous être envoyé.
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
export default {
  data() {
    return {
      email: "",
      password: "",
      snackbar: false,
    };
  },
  mounted() {
    if (this.$store.state.uid) return this.$router.push({ name: "Home" });
  },
  methods: {
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          const user = firebase.auth().currentUser;
          const actionCodeSettings = {
            url: "https://sportbase-38151.web.app/",
          };
          user.sendEmailVerification(actionCodeSettings);
          const db = firebase.firestore();
          console.log("user", user)
          db.collection("users")
            .doc(user.uid)
            .set({
              // photoURL: user.photoURL,
              // displayName: user.displayName,
              email: user.email,
            })
            .then((docRef) => {
              console.log("Document written with ID: ", docRef);
              this.snackbar = true;
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        })
        .catch((error) => {
          // catch any errors, set a data property called error
          this.error = error.message;
        });
    },
  },
};
</script>

<style scoped>
.bg {
  background: linear-gradient(168.29deg, #007991 0%, #2f3637 126.15%);
  height: 100vh;
  width: 100vw;
}
h1 {
  font-size: 3em;
  color: white;
  font-family: "Montserrat", sans-serif;
}
h2 {
  color: white;
  font-family: "Montserrat", sans-serif;
}
</style>
