<template>
  <div>
    <v-form @submit.prevent="register">
      <h2>Register</h2>
      <v-text-field type="email" label="Adresse email" v-model="email" />
      <v-text-field type="password" label="Mot de passe" v-model="password" />
      <button type="submit">Register</button>
    </v-form>
    <v-snackbar v-model="snackbar">
      Un e-mail de vérification vient de vous être envoyé.
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
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
          db.collection("users")
            .doc(user.uid)
            .set({
              photoURL: user.photoURL,
              displayName: user.displayName,
              email: user.email,
            })
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
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