import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      rightDrawerOpen: false,
      currDate: new Date(),
      plans: [],
      disp: {},
      selected: {},
      filterType: ['pcpj', 'distr'],
    },
    mutations: {
      updateDrawerOpen(state, payload) {
        state.rightDrawerOpen = payload;
      },
      setPlans(state, payload) {
        state.plans = payload;
      },
      setDisp(state, payload) {
        state.disp = payload;
      },
      updatePlan(state, payload) {
        const index = state.plans.findIndex(
          (stored) => stored.id_plan === payload.id_plan,
        );
        const updplan = { ...state.plans[index], ...payload };

        state.plans.splice(index, 1, updplan);
      },
    },
    actions: {
      async loadPlans({ commit, state }) {
        const response = await axios.get(`${process.env.API}/plans`, {
          params: {
            month: state.currDate.getMonth() + 1,
            year: state.currDate.getFullYear(),
          },
        });
        commit('setPlans', response.data.plans);
        commit('setDisp', response.data.disp);
      },
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV,
  });

  return Store;
}
