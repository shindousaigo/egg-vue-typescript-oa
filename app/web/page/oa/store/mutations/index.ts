import State from "../state";
import { Store } from "Vuex";
import { Notification } from "element-ui"

export default {
  set(state: State, { key, val }) {
    state[key] = val
  }
}

export function initialCommit(prototype, store: Store<State>) {

  prototype.$commit = new Proxy({}, {
    get(target, key: string) {
      return (val: any = "") => store.commit("set", {
        key,
        val
      })
    }
  })
  store.commit("set", {
    key: "$commit",
    val: prototype.$commit
  })

  prototype.$state = new Proxy({}, {
    get(target, key: string) {
      return store.state[key]
    }
  })
  store.state.$commit.$state(prototype.$state)

  prototype.$getters = new Proxy({}, {
    get(target, key: string) {
      return store.getters[key]
    }
  })
  store.state.$commit.$getters(prototype.$getters)

  prototype.$dispatch = new Proxy({}, {
    get(target, key: string) {
      return (payload: any = {}) => new Promise(function (resolve, reject) {
        store.dispatch(key, payload)
          .then(function (data) {
            resolve(data)
          })
          .catch(function (error) {
            reject(error)
            Notification.error(`${error} from ${key}`)
          })
      })
    }
  })
  store.state.$commit.$dispatch(prototype.$dispatch)

}