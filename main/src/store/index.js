import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ActiveName: 'main'
  },
  getters: {
    ActiveName: (state) => {
      return state.ActiveName
    },
  },
  mutations: {
    set_activeName: (state, payload) => {
      if (payload) {
        state.ActiveName = payload
      }
    },
  },
  actions: {
  },
  modules: {
  }
})