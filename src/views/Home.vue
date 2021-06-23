<template>
  <v-container>
    <Header></Header>
    <div class="mt-16">
      <v-card
        v-for="training in trainings"
        class="mt-2"
        v-bind:key="training.id"
      >
        <!-- {{training}} -->
        <v-card-title>
          <v-avatar size="56">
            <img alt="user" :src="training.user.photoURL" />
          </v-avatar>
          <p class="ml-3">
            {{ training.user.displayName }} - {{ training.title }}
          </p>
          <v-spacer />
          <v-rating
            empty-icon="mdi-arm-flex-outline"
            full-icon="mdi-arm-flex"
            hover
            label="Difficulté"
            v-model="training.difficulty"
            length="3"
            size="36"
            value="1"
            readonly
          ></v-rating>
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

          <v-btn icon @click="training.show = !training.show">
            <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="training.show">
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
    </div>
    <v-dialog v-model="warning" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Etes-vous prêt ?
        </v-card-title>

        <v-card-text>
          Pensez à lancer l'entrainement sur votre montre connectée si vous en
          avez une pour suivre votre entraînement.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="start()"> C'est parti !</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
              <v-progress-linear
                v-if="exo.timer"
                stream
                :value="progressValue"
              />
            </v-card>
            <v-btn
              v-if="index == selected.exercises.length - 1"
              @click="finish()"
            >
              FELICITATION
            </v-btn>
            <v-btn color="primary" v-else @click="next()">
              Prochain exercice
            </v-btn>

            <v-btn @click="close" text>Arrêter l'entraînement</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>
    <v-dialog v-model="dialog2" max-width="800">
      <v-card>
        <v-card-title class="text-h4 justify-center text-center primary">
          Félicitation!!
        </v-card-title>
        <v-card-text class="pt-6">
          <p class="text-center text-h6">
            Votre entrainement à durré {{ this.duration }}
          </p>
          <p class="text-center text-h6">Votre avez dépensé {{}} calories</p>
          <p class="text-center text-h6">Votre BPM moyen était de {{}}</p>
          <p class="text-center text-h6">Votre BPM max était de {{}}</p>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="close" text>Fermer</v-btn>
        </v-card-actions>
      </v-card>
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
      dialog2: false,
      url: null,
      code: null,
      data: [],
      perfom: [],
      duration: null,
      warning: false,
      progressValue: 0,
    };
  },

  mounted() {
    if (!this.$store.state.uid) return this.$router.push({ name: "Login" });
    // console.log(this.$store.state.startDate);
    // console.log(this.$store.state.endDate);
    const db = firebase.firestore();
    db.collection("trainings")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let obj = doc.data();
          obj.id = doc.id;
          obj.show = false;
          this.trainings.push(obj);
          return this.getData();
        });
      });
    this.parseUrl();
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
            // console.log("user", res.data());
            doc.user = res.data();
          });
        for (let i = 0; i < doc.exercises.length; i++) {
          db.collection("exercises")
            .doc(doc.exercises[i].exercise.id)
            .get()
            .then((res) => {
              // console.log("ex", res.data());
              doc.exercises[i].exercise = res.data();
              if (res.data().categorie == "haut") doc.haut++;
              if (res.data().categorie == "bas") doc.bas++;
            });
        }
      });
    },
    next() {
      // console.log(this.e1);
      this.e1++;
      this.progressValue = 0;
      if (this.selected.exercises[this.e1 - 1].timer)
        this.startTimer(this.selected.exercises[this.e1 - 1].timer);
    },
    start() {
      this.warning = false;
      this.dialog = true;
      if (this.selected.exercises[this.e1 - 1].timer)
        this.startTimer(this.selected.exercises[this.e1 - 1].timer);
    },
    close() {
      this.dialog = false;
      this.dialog2 = false;
    },
    startTimer(total) {
      let int = 100 / total;
      let time = setInterval(() => {
        this.progressValue += int;
        if (this.progressValue == 100) {
          clearInterval(time);
          if (this.e1 == this.selected.exercises.length) return this.finish();
          return this.next();
        }
      }, 1000);
    },

    startTraining(obj) {
      this.warning = true;
      console.log(obj);
      this.selected = obj;
      this.$store.commit("setStartDate", new Date().getTime());
    },
    finish() {
      this.progressValue = 0;
      this.$store.commit("setTrainingId", this.selected.id);
      this.dialog = false;
      this.$store.commit("setFinalDate", new Date().getTime());
      console.log(this.$store.state.startDate);
      console.log(this.$store.state.finalDate);
      // const self = this;
      this.e1 = 1;
      (this.selected = {
        title: "",
        exercises: [
          {
            rep: 0,
            timer: 0,
            exercise: { name: "", description: "" },
          },
        ],
      }),
        axios
          .get(
            "https://europe-west1-sportbase-38151.cloudfunctions.net/getLink"
          )
          .then(function (response) {
            console.log(response.data.url);
            // self.data = response.data.url;
            window.location.href = response.data.url;
            // return response.data;
          });
    },
    parseUrl() {
      this.url = window.location.search;
      console.log(this.url);
      if (this.url) {
        const queryURL = new urlParse(this.url);
        const code = queryParse.parse(queryURL.query).code;
        // console.log("code", code);
        this.getGoogleFitData(code);
      }
    },
    async getGoogleFitData(code) {
      const self = this;
      if (code) {
        var data = JSON.stringify({
          code: code,
          startTimeMillis: this.$store.state.startDate,
          endTimeMillis: this.$store.state.finalDate,
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
            // self.data = response.data;
            self.sendGoogleFitData(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log("no code");
      }
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

      const db = firebase.firestore();
      const performs = db.collection("performs");
      performs.doc().set({
        averageHeartRate: bpm.moy,
        calories: calories.calories,
        createdAt: firebase.firestore.Timestamp.fromDate(
          new Date(this.$store.state.startDate)
        ),
        duration: this.$store.state.finalDate - this.$store.state.startDate,
        endAt: firebase.firestore.Timestamp.fromDate(
          new Date(this.$store.state.finalDate)
        ),
        maxHeartRate: bpm.max,
        training: db.doc(`/trainings/${this.$store.state.trainingId}`),
        user: db.doc(`/users/${this.$store.state.uid}`),
      });
      this.duration = this.$store.state.finalDate - this.$store.state.startDate;
      console.log(this.duration);
    },
  },
};
</script>
