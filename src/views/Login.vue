<template>
  <v-container fluid class="bg">
    <v-row justify="center" class="pt-6"> <h1>SPORTBASE</h1></v-row>
    <v-form class="pt-12 mt-8">
      <v-row class="ma-5" justify="center">
        <v-btn min-width="250" @click="loginWithGoogle" class="justify-space-around">
          <img width="25" src="@/assets/google.png" alt="">
          <div>
            Connexion Google
          </div>
          </v-btn>
      </v-row>
      <v-row class="ma-5" justify="center">
        <v-btn min-width="250" @click="loginWithFB">
          <img width="35" src="@/assets/facebook.png" alt="">
          <div>
            Connexion Facebook
          </div>
        </v-btn>
      </v-row>
      <v-col class="mx-auto pt-8" cols="3">
        <v-text-field dark v-model="email" label="Mail"></v-text-field>
        <v-text-field dark v-model="password" label="Mot de passe"></v-text-field>
      </v-col>
      <div class="d-flex justify-center pt-8">
        <v-btn min-width="250" @click="submit">Connexion</v-btn>
      </div>
    </v-form>
    <div class="d-flex justify-center">
      <router-link :to="{name:'Register'}">
        <v-btn color="primary" min-width="250" class="mt-5">Inscription</v-btn>
      </router-link>
    </div>
    <div class="d-flex justify-center pt-4">
      <p class="dark">Mot de passe oublié?</p>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
// import auth from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  mounted() {
    if (this.$store.state.uid) return this.$router.push({ name: "Home" });
  },
  methods: {
    loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (userCredentials) => {
          let idToken;
          await firebase
            .auth()
            .currentUser.getIdToken(true)
            .then((res) => {
              idToken = res;
              console.log(userCredentials.user, idToken);
              let user = {
                uid: userCredentials.user.uid,
                email: userCredentials.user.email,
                emailVerified: userCredentials.user.emailVerified,
                displayName: userCredentials.user.displayName,
                photoURL: userCredentials.user.photoURL,
                isAdmin: userCredentials.user.isAdmin,
              };

              this.$store.commit("setUser", user);
              if (userCredentials.additionalUserInfo.isNewUser) {
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
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error);
                  });
                return this.$router.push({ name: "Settings" });
              }
              this.$router.push({ name: "Home" });
            });
        });
    },
    loginWithFB() {
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("profile_pic");
      provider.addScope("name");

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (userCredentials) => {
          let idToken;
          await firebase
            .auth()
            .currentUser.getIdToken(true)
            .then((res) => {
              idToken = res;
              console.log(user, idToken);
              let user = {
                uid: userCredentials.user.uid,
                email: userCredentials.user.email,
                emailVerified: userCredentials.user.emailVerified,
                displayName: userCredentials.user.emailVerified,
                photoURL: userCredentials.user.emailVerified,
                isAdmin: userCredentials.user.emailVerified,
              };
              this.$store.commit("setUser", user);
              if (userCredentials.additionalUserInfo.isNewUser) {
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
                  })
                  .catch((error) => {
                    console.error("Error adding document: ", error);
                  });
                return this.$router.push({ name: "Settings" });
              }
              return this.$router.push({ name: "Home" });
            });
        });
    },
    submit() {
      // [START auth_signin_password]
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((userCredentials) => {
          console.log("user", userCredentials, userCredentials.user);
          let user = {
            uid: userCredentials.user.uid,
            email: userCredentials.user.email,
            emailVerified: userCredentials.user.emailVerified,
            displayName: userCredentials.user.emailVerified,
            photoURL: userCredentials.user.emailVerified,
            isAdmin: userCredentials.user.emailVerified,
          };
          this.$store.commit("setUser", user);
          this.$router.push({ name: "Home" });
        })
        .catch((error) => {
          console.log(error);
        });
      // [END auth_signin_password]
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
</style>
