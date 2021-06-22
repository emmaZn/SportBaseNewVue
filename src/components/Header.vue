<template>
  <v-app-bar :clipped-left="clipped" fixed app>
    <router-link :to="{ name: 'Home' }"
      ><v-app-bar-title style="width: 500px">SPORTBASE</v-app-bar-title>
    </router-link>
    <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
    <v-spacer></v-spacer>
    <v-row justify="end" align="center" class="mr-5"
      ><v-col cols="2" justify="center">
        <router-link :to="{ name: 'NewTraining' }">

        <v-row>
          <v-btn icon class="ma-auto"
            ><v-icon>mdi-plus-circle-outline</v-icon></v-btn
          ></v-row
        ><v-row justify="center"> <p>Nouveau</p></v-row>
        </router-link>
      </v-col>
      <v-col cols="2">
        <router-link :to="{ name: 'Home' }">
          <v-row>
            <v-btn icon class="ma-auto"
              ><v-icon>mdi-home</v-icon></v-btn
            ></v-row
          ><v-row justify="center"> <p>Accueil</p></v-row>
        </router-link>
      </v-col>
      <v-col cols="2">
        <router-link :to="{ name: 'Settings' }">
          <v-row>
            <v-btn icon class="ma-auto"
              ><v-icon>mdi-account</v-icon></v-btn
            ></v-row
          ><v-row justify="center"> <p>Compte</p></v-row>
        </router-link>
      </v-col>
      <v-col cols="2">
        <v-row>
          <v-btn icon class="ma-auto"
            ><v-icon>mdi-magnify</v-icon></v-btn
          ></v-row
        ><v-row justify="center"> <p>Rechercher</p></v-row>
      </v-col>
    </v-row>
    <!-- <v-btn @click="logout"> Déconnexion </v-btn> -->
  </v-app-bar>
</template>

<script>
import "firebase/auth";
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire",
        },
        {
          icon: "mdi-account",
          title: "Login",
          to: "/login",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "SportBase",
    };
  },
};
</script>
<style scoped>
.v-application a {
  text-decoration: none !important;
  color: #007991 !important;
}
p {
  margin-top: -10px;
  text-align: center;
}
</style>
