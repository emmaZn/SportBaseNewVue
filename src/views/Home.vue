<template>
  <v-container>
    <Header></Header>
    <v-card v-for="training in trainings" v-bind:key="training.id">
      <!-- {{training}} -->
      <v-card-title class="mt-8">
        <v-avatar size="56">
          <img alt="user" :src="training.user.photoURL" />
        </v-avatar>
        <p class="ml-3">
          {{ training.user.displayName }} - {{ training.title }}
        </p>
      </v-card-title>

      <v-card-text>{{ training.description }}</v-card-text>
      <v-card-text v-if="training.haut == 0"
        >Catégorie : Bas du corps</v-card-text
      >
      <v-card-text v-else-if="training.bas == 0"
        >Catégorie : Haut du corps</v-card-text
      >
      <v-card-text v-else-if="training.bas != 0 && training.haut != 0"
        >Catégorie : Haut et bas du corps</v-card-text
      >
      <v-card-actions>
        <v-btn color="primary" text @click="startTraining(training)">
          Lancer l'entrainement</v-btn
        >

        <v-spacer></v-spacer>

        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>

          <v-card-text>
            <v-list dense>
              <v-subheader>Exercices</v-subheader>
              <v-list-item-group color="primary">
                <v-list-item v-for="(exo, i) in training.exercises" :key="i">
                  <!-- {{ exo }} -->
                  <v-list-item-content>
                    <v-list-item-title>{{
                      exo.exercise.name
                    }}</v-list-item-title>
                    <v-list-item-subtitle v-if="exo.rep"
                      >{{ exo.rep }} répétitions</v-list-item-subtitle
                    >
                    <v-list-item-subtitle v-if="exo.timer"
                      >{{ exo.timer }} secondes</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
    <v-dialog v-model="dialog">
      <!-- {{ selected }} -->
      <v-stepper alt-labels v-model="e1">
        <v-stepper-header>
          <v-stepper-step
            v-for="(exo, index) in selected.exercises"
            :step="index + 1"
            :complete="e1 > index + 1"
            v-bind:key="exo"
          >
            {{ exo.exercise.name }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content
            v-for="(exo, index) in selected.exercises"
            :step="index + 1"
            v-bind:key="exo"
          >
            <v-card class="mb-12">
              <v-card-title>{{ exo.exercise.name }}</v-card-title>
              <v-card-subtitle v-if="exo.rep"
                >{{ exo.rep }} répétitions</v-card-subtitle
              >
              <v-card-subtitle v-if="exo.timer"
                >{{ exo.timer }} secondes</v-card-subtitle
              >
              <v-card-text>{{ exo.exercise.description }}</v-card-text>
            </v-card>
            <v-btn v-if="index == selected.exercises.length - 1" @click="finish()"
              >FELICITATION</v-btn
            >
            <v-btn color="primary" v-else @click="next()">
              Prochain exercice
            </v-btn>

            <v-btn text>annuler</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import Header from "../components/Header.vue";

export default {
  name: "Home",
  components: {
    Header: Header,
  },
  data() {
    return {
      e1: 1,
      trainings: [],
      show: false,
      selected: {
        title: "",
        exercises: [
          {
            rep: 0,
            timer: 0,
            exercise: { name: "", description: "" },
          },
        ],
      },
      dialog: false,
    };
  },

  mounted() {
    if (!this.$store.state.uid) return this.$router.push({ name: "Login" });
    const db = firebase.firestore();
    db.collection("trainings")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.trainings.push(doc.data());
          return this.getData();
        });
      });
  },
  methods: {
    getData() {
      const db = firebase.firestore();
      this.trainings.forEach((doc) => {
        doc.haut = 0;
        doc.bas = 0;
        db.collection("users")
          .doc(doc.user.id)
          .get()
          .then((res) => {
            console.log("user", res.data());
            doc.user = res.data();
          });
        for (let i = 0; i < doc.exercises.length; i++) {
          db.collection("exercises")
            .doc(doc.exercises[i].exercise.id)
            .get()
            .then((res) => {
              console.log("ex", res.data());
              doc.exercises[i].exercise = res.data();
              if (res.data().categorie == "haut") doc.haut++;
              if (res.data().categorie == "bas") doc.bas++;
            });
        }
      });
    },
    next() {
      console.log(this.e1);
      this.e1++;
    },
    startTraining(obj) {
      this.dialog = true;
      console.log(obj);
      this.selected = obj;
      this.$store.commit("setStartDate", new Date().getTime());
    },
    finish() {
      this.dialog = false;
      this.$store.commit("setFinalDate", new Date().getTime());
    },
  },
};
</script>
