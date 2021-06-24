<template>
  <div>
    <Header></Header>
    <!-- A preview of the image. -->
    <v-row justify="center" class="mt-16">
      <v-col cols="8">
        <v-row>
          <v-spacer></v-spacer>
          <v-btn @click="logout" color="error"> Déconnexion </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2">
        <v-badge
          bordered
          color="transparent"
          class="mt-16"
          offset-x="10"
          offset-y="10"
        >
          <v-btn
            slot="badge"
            fab
            small
            style="z-index: 1"
            @click="launchImageFile"
            :disabled="isUploadingImage"
            type="button"
          >
            <v-icon> mdi-pen </v-icon>
          </v-btn>
          <v-avatar size="90">
            <v-img
              :src="$store.state.photoURL"
              aspect-ratio="1"
              rounded
              @click="launchImageFile"
              :disabled="isUploadingImage"
              type="button"
            />
          </v-avatar>
        </v-badge>
      </v-col>
      <v-col cols="8">
        <input
          ref="imageFile"
          @change.prevent="uploadImageFile($event.target.files)"
          type="file"
          accept="image/png, image/jpeg"
          class="hidden"
          style="display: none"
        />
        <v-text-field
          v-model="$store.state.email"
          readonly
          label="Email"
          class="mt-5"
        ></v-text-field>
        <v-text-field v-model="displayName" label="Pseudo"></v-text-field>
        <v-row
          ><v-btn @click="setDisplayName" color="primary" class="ma-auto"
            >Enregistrer</v-btn
          ></v-row
        >
      </v-col>
    </v-row>
    <p class="text-h4 pt-12 pl-4">Liste de mes performances</p>
    <div class="d-flex flex-wrap justify-space-around pt-12">
      <v-card
        class="mb-8"
        width="370"
        v-for="perform in performs"
        :key="perform.id"
      >
        <v-card-title class="title justify-center text-center primary">
          {{ perform.training.title }}
        </v-card-title>
        <v-card-text class="pt-2">
          <p>
            L'entraînement du <span class="font-weight-bold">{{ formatDate(perform.createdAt.toDate()) }}  </span> à
            duré <span class="font-weight-bold">{{ formatTime(perform.duration) }} </span>
          </p>
          <p class="pt-2">BPM moyen <span class="font-weight-bold">{{ perform.averageHeartRate }} </span></p>
          <p>BPM max <span class="font-weight-bold">{{ perform.maxHeartRate }} </span></p>
          <p>calories dépensées <span class="font-weight-bold">{{ perform.calories }} </span></p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script>
import firebase from "firebase/app";
import Header from "../components/Header.vue";

export default {
  components: {
    Header: Header,
  },
  data() {
    return {
      isUploadingImage: false,
      isDeletingImage: false,
      displayName: this.$store.state.displayName,
      performs: [],
      formatDuration: null,
    };
  },
  mounted() {
    if (!this.$store.state.uid) return this.$router.push({ name: "Login" });
    const db = firebase.firestore();
    let ref = db.doc("users/" + this.$store.state.uid);
    db.collection("performs")
      .where("user", "==", ref)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let obj = doc.data();
          obj.id = doc.id;
          obj.show = false;
          this.performs.push(obj);
          return this.getData();
        });
      });
    console.log(this.performs);
    // console.log(firebase.firestore.FieldValue.serverTimestamp().toDate())
  },
  methods: {
    launchImageFile() {
      // Trigger the file input click event.
      this.$refs.imageFile.click();
    },
    uploadImageFile(files) {
      if (!files.length) {
        return;
      }
      const file = files[0];

      if (!file.type.match("image.*")) {
        alert("Please upload an image.");
        return;
      }

      const metadata = {
        contentType: file.type,
      };

      this.isUploadingImage = true;

      // Create a reference to the destination where we're uploading
      // the file.
      const storage = firebase.storage();
      const imageRef = storage.ref(`images/${file.name}`);
      const uploadTask = imageRef
        .put(file, metadata)
        .then((snapshot) => {
          // Once the image is uploaded, obtain the download URL, which
          // is the publicly accessible URL of the image.
          return snapshot.ref.getDownloadURL().then((url) => {
            return url;
          });
        })
        .catch((error) => {
          console.error("Error uploading image", error);
        });

      // When the upload ends, set the value of the blog image URL
      // and signal that uploading is done.
      uploadTask.then((url) => {
        const user = firebase.auth().currentUser;
        user
          .updateProfile({
            photoURL: url,
          })
          .then(() => {
            this.$store.commit("setPhoto", url);
          })
          .catch((error) => {
            console.log(error);
          });
        const db = firebase.firestore();
        db.collection("users").doc(user.uid).update({
          photoURL: url,
        });
        this.isUploadingImage = false;
      });
    },
    deleteImage() {
      firebase
        .storage()
        .ref(this.$store.state.authUser.photoURL)
        .delete()
        .then(() => {
          this.$store.commit("setPhoto", "");
        })
        .catch((error) => {
          console.error("Error deleting image", error);
        });
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.commit("logout");
          this.$router.push({ name: "Login" });
        })
        .catch((error) => {
          alert(error.message);
          this.$router.push({ name: "Login" });
        });
    },
    setDisplayName() {
      const user = firebase.auth().currentUser;
      const db = firebase.firestore();
      db.collection("users").doc(user.uid).update({
        displayName: this.displayName,
      });
      user
        .updateProfile({
          displayName: this.displayName,
        })
        .then(() => {
          this.$store.commit("setDisplayName", this.displayName);
        });
    },
    getData() {
      const db = firebase.firestore();
      this.performs.forEach((doc) => {
        db.collection("users")
          .doc(doc.user.id)
          .get()
          .then((res) => {
            // console.log("user", res.data());
            doc.user = res.data();
          });
        db.collection("trainings")
          .doc(doc.training.id)
          .get()
          .then((res) => {
            // console.log("user", res.data());
            doc.training = res.data();
          });
      });
    },
    formatTime(date) {
      var ms = date; // don't forget the second param
      var hours = Math.floor(ms / 360000);
      var minutes = Math.floor((ms - hours * 360000) / 60000);
      var seconds = Math.floor((ms - hours * 360000 - minutes * 60000) / 1000);

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return minutes + " min " + seconds + " secondes";
    },
    formatDate(date) {
      var moment = require("moment");
      console.log(moment(date, "MM-DD-YYYY"));
      return moment(date).format("DD/MM/YYYY");
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
}

.title {
  color: white !important;
}
</style>