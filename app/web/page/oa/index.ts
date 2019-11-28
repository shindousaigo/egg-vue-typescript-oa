import App from '../../framework/app';
import createStore from './store/index';
import createRouter from './router/index';
import entry from './view/container.vue';
import Vue from 'vue'
import { initialCommit } from "./store/mutations";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserTag, faFile, faFileAlt, faBan, faCaretSquareDown, faEdit, faTimes, faInfoCircle, faLongArrowAltUp, faLongArrowAltDown, faEnvelope, faCheckCircle, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'
library.add(faUserTag, faFile, faFileAlt, faBan, faCaretSquareDown, faEdit, faTimes, faInfoCircle, faLongArrowAltUp, faLongArrowAltDown, faEnvelope, faCheckCircle, faEnvelopeOpen)

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as RouterConstant from "./router/const";

Vue.component('font-awesome-icon', FontAwesomeIcon)

const beforeCreate = function ({ store }) {
  const prototype = Vue.prototype
  prototype.console = {
    log: function (...args) {
      args.forEach(val => console.log(val))
    }
  }
  prototype.$hours = (function () {
    const c = {}, D = "天", d = 7.5, H = "h"
    return function (h: number) {
      if (h) {
        if (!c[h]) {
          if (h > 0) {
            c[h] = {
              d: Math.floor(h / d),
              h: h % d
            }
          } else {
            c[h] = {
              d: Math.floor(h / -d),
              h: h % -d
            }
          }
        }
        return `${c[h].d ? (c[h].d + D) : ""}${c[h].h ? (c[h].h + H) : ""}`
      }
      return 0 + D
    }
  })()
  Object.keys(RouterConstant).forEach(key => {
    prototype[key] = RouterConstant[key]
  })
  initialCommit(prototype, store)
}

export default new App({
  entry, createStore, createRouter, beforeCreate
}).bootstrap() as any
