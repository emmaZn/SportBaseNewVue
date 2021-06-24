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
    <div class="d-flex flex-wrap justify-space-around pt-12">
      <div v-for="perform in performs" :key="perform.id">
        <p>BPM moyen{{perform.averageHeartRate}}</p>
        <p>calories dépensées {{perform.calories}}</p>
        <p>calories dépensées {{perform.calories}}</p>
        
      </div>
    </div>
    <v-row>
      
    </v-row>
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
    };
  },
  mounted() {
    if (!this.$store.state.uid) return this.$router.push({ name: "Login" });
    const db = firebase.firestore();
    db.collection("performs")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let obj = doc.data();
          obj.id = doc.id;
          obj.show = false;
          this.performs.push(obj);
          // return this.getData();
        });
      });
      console.log(this.performs);
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
      user
        .updateProfile({
          displayName: this.displayName,
        })
        .then(() => {
          this.$store.commit("setDisplayName", this.displayName);
        });
    },
  },
};
</script>

<style scoped>
p{
  margin: 0;
  padding: 0;
} 
</style>