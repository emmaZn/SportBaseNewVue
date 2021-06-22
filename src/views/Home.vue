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
            <v-btn
              v-if="index == selected.exercises.length - 1"
              @click="finish()"
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
// import { Timestamp } from "firebase/firestore";
// import { db } from "@/plugins/firebase";
import Header from "../components/Header.vue";
import axios from "axios";
import urlParse from "url-parse";
import queryParse from "query-string";

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
      url: null,
      code: null,
      data: [],
      perfom: [],
    };
  },

  mounted() {
    if (!this.$store.state.uid) return this.$router.push({ name: "Login" });
    // console.log(this.$store.state.uid);
    const db = firebase.firestore();
    db.collection("trainings")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let obj=doc.data()
          obj.id=doc.id
          this.trainings.push(obj);
          return this.getData();
        });
      });
      // var time = new Date().getTime(); // get your number
      // console.log(time);
      // var date = new Date(time); // create Date object
      // console.log(date);

    // const performs = db.collection("performs");
    // performs.doc().set({
    //   averageHeartRate: 100,
    //   calories: 100,
    //   createdAt: firebase.firestore.Timestamp.fromDate(
    //     new Date(this.$store.state.startDate)
    //   ),
    //   duration: this.$store.state.finalDate - this.$store.state.startDate,
    //   endAt: firebase.firestore.Timestamp.fromDate(
    //     new Date(this.$store.state.finalDate)
    //   ),
    //   maxHeartRate: 100,
    //   training: db.doc("/trainings/Y1MYov0raqq7Bm78hVym"),
    //   user: db.doc(`/users/${this.$store.state.uid}`), 
    // });
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
      // console.log(this.$store.state.startDate);
      // console.log(this.$store.state.endDate);
      // const self = this;
      // axios
      //   .get("https://europe-west1-sportbase-38151.cloudfunctions.net/getLink")
      //   .then(function (response) {
      //     console.log(response.data.url);
      //     // self.data = response.data.url;
      //     window.location.href = response.data.url;
      //     // return response.data;
      //   });
      console.log("training",this.selected)

    },
    parseUrl() {
      this.url = window.location.search;
      if (this.url) {
        const queryURL = new urlParse(this.url);
        const code = queryParse.parse(queryURL.query).code;
        console.log("code", code);
        this.getGoogleFitData(code);
      }
    },
    async getGoogleFitData(code) {
      const self = this;
      if (code) {
        // console.log(code);
        var data = JSON.stringify({
          code: code,
        });

        var config = {
          method: "post",
          url: "https://europe-west1-sportbase-38151.cloudfunctions.net/postData",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        await axios(config)
          .then(function (response) {
            self.data = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log("no code");
      }
      this.sendGoogleFitData(self.data);
    },
    sendGoogleFitData(data) {
      var bpm = [];
      var calories = [];
      console.log(data);
      data.bpm.forEach((dbpm, index) => {
        if (index === 0) {
          bpm.moy = dbpm.fpVal;
        } else if (index === 1) {
          bpm.max = dbpm.fpVal;
        } else if (index === 2) {
          bpm.min = dbpm.fpVal;
        }
        // console.log(index);
      });
      data.calories.forEach((cal) => {
        calories.calories = cal.fpVal;
      });
      this.perfom.bpm = bpm;
      this.perfom.calories = calories;
      // console.log(bpm);
      // console.log(calories);
      console.log(this.perfom);
    },
  },
};
</script>
