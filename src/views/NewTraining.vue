<template>
  <v-container class="mt-16">
    <v-row justify="center">
      <v-col cols="9">
        <Header></Header>
        <v-text-field
          v-model="object.title"
          label="Titre de l'entraînement"
        ></v-text-field>
        <v-textarea
          v-model="object.description"
          label="Description"
        ></v-textarea>
        Difficulé
        <v-rating
          empty-icon="mdi-arm-flex-outline"
          full-icon="mdi-arm-flex"
          hover
          label="Difficulté"
          v-model="object.difficulty"
          length="3"
          size="56"
          value="1"
        ></v-rating>
        <div>
          Exercices :
          <v-card class="mt-2">
            <v-row class="ma-0 pt-2"
              ><v-col cols="5" class="ma-0 pa-0">
                <v-select
                  v-model="line.exercise"
                  class="ml-2"
                  label="Exercice"
                  :items="exercises"
                  item-text="name"
                  return-object
                  dense
                ></v-select>
              </v-col>
              <v-col cols="2" class="ma-0 pa-0"
                ><v-text-field
                  v-model="number"
                  class="ml-5"
                  label="Nombre"
                  type="number"
                  dense
                ></v-text-field
              ></v-col>
              <v-col cols="4" class="ma-0 pa-0">
                <v-radio-group v-model="type" row dense class="mt-2 ml-5 pa-0">
                  <v-radio label="Secondes" value="timer"></v-radio>
                  <v-radio
                    label="Répétitions"
                    value="rep"
                  ></v-radio> </v-radio-group
              ></v-col>
              <v-col cols="1" class="ma-0 pa-0"
                ><v-btn icon color="primary" @click="add"
                  ><v-icon>mdi-plus-circle-outline</v-icon></v-btn
                ></v-col
              ></v-row
            >
          </v-card>
          <div class="mt-5 ml-4">
            <v-row v-for="(exo, index) in object.exercises" :key="index">
              - {{ exo.name }} :
              <span v-if="exo.timer"> {{ exo.timer }} secondes </span
              ><span v-if="exo.rep"> {{ exo.rep }} répétitions </span>
            </v-row>
          </div>
        </div>
        <v-btn class="mt-8" bottom block dark @click="create">
          Créer l'entraînement
        </v-btn></v-col
      ></v-row
    >
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
      type: "timer",
      number: 10,
      object: {
        title: "",
        description: "",
        exercises: [],
        difficulty: 1,
      },
      exercises: [],
      line: {
        exercise: {},
        rep: 0,
        timer: 0,
      },
    };
  },
  mounted() {
    if (!this.$store.state.uid) return this.$router.push({ name: "Login" });
    const db = firebase.firestore();
    db.collection("exercises")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let obj = doc.data();
          obj.id = doc.id;
          this.exercises.push(obj);
        });
      });
  },
  methods: {
    add() {
      const db = firebase.firestore();

      if (this.type == "timer") {
        console.log(this.line.exercise);

        this.object.exercises.push({
          exercise: db.doc("exercises/" + this.line.exercise.id),
          rep: 0,
          timer: this.number,
          name: this.line.exercise.name,
        });
      } else
        this.object.exercises.push({
          exercise: db.doc("exercises/" + this.line.exercise.id),
          rep: this.number,
          timer: 0,
          name: this.line.exercise.name,
        });
    },
    delete() {},
    create() {
      const db = firebase.firestore();

      db.collection("trainings")
        .add({
          exercises: this.object.exercises,
          title: this.object.title,
          description: this.object.description,
          difficulty: this.object.difficulty,
          user: db.doc("users/" + this.$store.state.uid),
          avgRating: 2.5,
          numRatings: 0,
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          return this.$router.push({ name: "Home" });
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    },
  },
};
</script>

<style>
</style>