<template>
  <div>
    <!-- <p>

  {{this.url}}
  </p> -->
    <button @click="getData">getData</button>
  </div>
</template>

<script>
import urlParse from "url-parse";
import queryParse from "query-string";
import axios from "axios";
export default {
  data() {
    return {
      url: null,
      code: null,
      data: []
    };
  },
  mounted() {
    this.url = window.location.search;
    if (this.url) {
      const queryURL = new urlParse(this.url);
      // console.log("queryurl",queryURL)
      this.code = queryParse.parse(queryURL.query).code;
      // console.log("code",code);
    }
  },
  methods: {
    async getData() {
      const self = this
      if (this.code) {
        // console.log(this.code);
        var data = JSON.stringify({
          code: this.code,
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
            self.data = response.data

          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log("no code");
      }
      this.sendData(self.data);
    },
    sendData(data) {
      var bpm = []
      var calories = []
      console.log(data);
      data.bpm.forEach((dbpm, index) => {
        if (index === 0) {
          bpm.moy = dbpm.fpVal
        } else if (index === 1) {
          bpm.max = dbpm.fpVal
        } else if (index === 2) {
          bpm.min = dbpm.fpVal
        }
        // console.log(index);
      });
      data.calories.forEach(cal => {
        calories.calories = cal.fpVal 
      });
      console.log(bpm);
      console.log(calories);
    }
  },
};
</script>

<style lang='postcss' scoped>
</style>