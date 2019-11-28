import Vue from 'vue';
import Vuex from 'vuex';
import State, { InitState } from "./state"
import Mutations from "./mutations"
import Getters from "./getters";
import Actions from "./actions";

Vue.use(Vuex);

export default function createStore(initState: InitState) {
  const storeIns = new Vuex.Store<State>({
    state: new State(initState),
    mutations: Mutations,
    getters: Getters.Instance.map,
    actions: Actions.Instance.map
  });
  Actions.Instance.state = storeIns.state
  return storeIns
}