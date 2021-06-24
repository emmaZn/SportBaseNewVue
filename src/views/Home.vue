<template>
  <v-container>
    <Header></Header>
    <div class="ma-16">
      <v-card v-for="training in trainings" class="mt-5 ml-16 mr-16" :key="training.id">
        <!-- {{training}} -->

        <v-card-title>
          <v-row>
            <v-col cols="1">
              <v-avatar size="56">
                <img alt="user" :src="training.user.photoURL" />
              </v-avatar>
            </v-col>
            <v-col cols="8" class="pl-0">
              <p class="ml-3 mb-0">
                {{ training.user.displayName }} - {{ training.title }}
              </p>
              <span class="pt-0 pl-3" v-if="training.haut == 0"
                ><b>Catégorie : </b> Bas du corps</span
              >
              <v-card-text class="pt-0 pl-3" v-else-if="training.bas == 0"
                ><b>Catégorie : </b> Haut du corps</v-card-text
              >
              <span
                class="pt-0 pl-3"
                v-else-if="training.bas != 0 && training.haut != 0"
                ><b>Catégorie : </b>Haut et bas du corps</span
              >
            </v-col>
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
          </v-row>
        </v-card-title>

        <v-card-text>{{ training.description }}</v-card-text>

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
    <v-dialog v-model="dialog" width="1000">
      <!-- {{ selected }} -->
      <v-stepper alt-labels v-model="e1">
        <v-stepper-header>
          <v-stepper-step
            v-for="(exo, index) in selected.exercises"
            :step="index + 1"
            :complete="e1 > index + 1"
            v-bind:key="index"
          >
            {{ exo.exercise.name }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content
            v-for="(exo, index) in selected.exercises"
            :step="index + 1"
            v-bind:key="index"
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
              <v-row
                ><v-spacer></v-spacer>
                <h1 class="mr-5" v-if="exo.timer">{{ timeLeft }}</h1></v-row
              >
              <v-progress-linear
                class="mt-5"
                v-if="exo.timer"
                stream
                height="10"
                buffer-value="0"
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
        <v-card-title class="title text-h4 justify-center text-center primary">
          Félicitation!!
        </v-card-title>
        <v-card-text class="pt-6">
          <p class="text-center text-h6">
            Votre entrainement à duré <span class="font-weight-bold">{{ this.formatDuration }}</span>
          </p>
          <p class="text-center text-h6">Votre avez dépensé <span class="font-weight-bold">{{this.calories}}</span>  calories</p>
          <p class="text-center text-h6">Votre BPM moyen était de <span class="font-weight-bold">{{this.bpm.moy}}</span> </p>
          <p class="text-center text-h6">Votre BPM max était de <span class="font-weight-bold">{{this.bpm.max}}</span> </p>
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
      formatDuration:null,
      bpm : {
        moy: null,
        max: null
      },
      calories: null,
      timeLeft: 100,
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
      this.e1 = 1;
      clearInterval();
      this.selected = {
        title: "",
        exercises: [
          {
            rep: 0,
            timer: 0,
            exercise: { name: "", description: "" },
          },
        ],
      };
    },

    startTimer(total) {
      this.timeLeft = total;
      let int = 100 / total;
      let time = setInterval(() => {
        this.progressValue += int;
        if (this.timeLeft > 0) this.timeLeft -= 1;
        if (this.progressValue == 120) {
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
      if (this.url) {
        console.log(this.url);
        const queryURL = new urlParse(this.url);
        const code = queryParse.parse(queryURL.query).code;
        // console.log("code", code);
        this.getGoogleFitData(code);
      }
    },
    async getGoogleFitData(code) {
      console.log(code)
      console.log(this.$store.state.startDate)
      console.log(this.$store.state.finalDate)
      const self = this;
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
          self.data = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
        self.sendGoogleFitData(this.data);
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
      this.bpm.moy = Math.floor(bpm.moy)
      this.bpm.max = Math.floor(bpm.max)
      this.calories = Math.floor(calories.calories)
      this.formatTime()

      const db = firebase.firestore();
      const performs = db.collection("performs");
      performs.doc().set({
        averageHeartRate: Math.floor(bpm.moy),
        calories: Math.floor(calories.calories),
        createdAt: firebase.firestore.Timestamp.fromDate(
          new Date(this.$store.state.startDate)
        ),
        duration: this.$store.state.finalDate - this.$store.state.startDate,
        endAt: firebase.firestore.Timestamp.fromDate(
          new Date(this.$store.state.finalDate)
        ),
        maxHeartRate: Math.floor(bpm.max),
        training: db.doc(`/trainings/${this.$store.state.trainingId}`),
        user: db.doc(`/users/${this.$store.state.uid}`),
      });
      this.dialog2 = true
    },
    formatTime() {
      this.duration = this.$store.state.finalDate - this.$store.state.startDate;
      console.log(this.$store.state.finalDate );
      console.log(this.$store.state.startDate);
      console.log(this.duration);
      var ms = this.duration // don't forget the second param
      var hours   = Math.floor(ms / 360000);
      var minutes = Math.floor((ms - (hours * 360000)) / 60000);
      var seconds = Math.floor((ms - (hours * 360000) - (minutes * 60000)) / 1000);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      this.formatDuration = minutes+' min '+seconds+' secondes'
      console.log( this.formatDuration);
    }
  },
};
</script>

<style scoped>
.title {
  color: white!important;
}
</style>