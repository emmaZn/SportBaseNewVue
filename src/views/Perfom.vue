<template>
  <div>
    <div class="home"></div>
    <a :href="this.data">ggfit</a>
  </div>
</template>

<script>
// @ is an alias to /src
// import {google} from 'googleapis'
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      data: null,
    };
  },
  mounted() {
    const self = this;
    axios
      .get("https://europe-west1-sportbase-38151.cloudfunctions.net/getLink")
      .then(function (response) {
        console.log(response.data.url);
        self.data = response.data.url;
        // return response.data;
      });
  },
  methods: {
  },
};
</script>
