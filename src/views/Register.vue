<template>
  <div>
    <v-form @submit.prevent="register">
      <h2>Register</h2>
      <v-text-field type="email" label="Adresse email" v-model="email" />
      <v-text-field type="password" label="Mot de passe" v-model="password" />
      <button type="submit">Register</button>
    </v-form>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  data() {
    return {
      email: "",
      password: "",
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
        })
        .catch((error) => {
          // catch any errors, set a data property called error
          this.error = error.message;
        });
    },
  },
};
</script>