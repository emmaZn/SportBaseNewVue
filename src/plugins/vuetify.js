import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#007991',
          secondary: '#60ABBA',
          accent: '#8c9eff',
          error: '#b71c1c',
        },
      },
    },
  })