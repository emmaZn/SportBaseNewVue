import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uid: null,
    email: null,
    emailVerified: null,
    displayName: null,
    photoURL: null,
    isAdmin: null,
    startDate:null,
    finalDate:null
  },
  mutations: {
    setUser(state, user) {
      state.uid = user.uid
      state.email = user.email
      state.emailVerified = user.emailVerified
      state.displayName = user.displayName
      state.photoURL = user.photoURL
      state.isAdmin = user.isAdmin
    },
    setPhoto(state, url) {
      state.photoURL = url
    },
    setDisplayName(state, name) {
      state.displayName = name
    },
    setStartDate(state, date) {
      state.startDate = date
    },
    setFinalDate(state, date) {
      state.finalDate = date
    },
    logout(state) {
      state.uid = null
      state.email = null
      state.emailVerified = null
      state.displayName = null
      state.photoURL = null
      state.isAdmin = null
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]

})
