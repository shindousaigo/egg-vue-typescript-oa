import App from '../../framework/app';
import createStore from './store/index';
import createRouter from './router/index';
import entry from './view/container.vue';
import Vue, { DirectiveOptions } from "vue"
import { initialCommit } from "./store/mutations";
import { Input } from "element-ui"

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserTag, faFile, faFileAlt, faBan, faCaretSquareDown, faEdit, faTimes, faInfoCircle, faLongArrowAltUp, faLongArrowAltDown, faEnvelope, faCheckCircle, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'
library.add(faUserTag, faFile, faFileAlt, faBan, faCaretSquareDown, faEdit, faTimes, faInfoCircle, faLongArrowAltUp, faLongArrowAltDown, faEnvelope, faCheckCircle, faEnvelopeOpen)

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as RouterConstant from "./router/const";
import { Enum } from "./store/actions";

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
  Vue.directive("required", (function () {
    const expressionMap = {} as {
      [key: string]: {
        els: HTMLElement[]
        ins: Input[]
      }
    }
    return {
      bind() { },
      inserted(el, binding, vnode) {
        const expression = binding.expression
        if (!expression) {
          console.error("v-required needs expression")
          return
        }
        switch (expression) {
          case "submit":
            el.onclick = function () {
              const expressions = Object.keys(expressionMap)
              const errors = [] as any
              expressions.forEach(expression => {
                expressionMap[expression].els.forEach(function (el) {
                  el.classList.add("v_required_submit")
                })

                if (expression.match(/\[*\]/)) {
                  if (expressionMap[expression].ins.filter(_in => {
                    if (_in.$el.classList.contains("el-checkbox-group")) {
                      return !(_in.value as any).length
                    } else {
                      return !_in.value
                    }
                  }).length !== 0) {
                    errors.push(expression)
                  }
                } else {
                  if (expressionMap[expression].ins.filter(_in => {
                    if (_in.$el.classList.contains("el-checkbox-group")) {
                      return !(_in.value as any).length
                    } else {
                      return !_in.value
                    }
                  }).length === expressionMap[expression].ins.length) {
                    errors.push(expression)
                  }
                }
              })
              if (errors.length === 0) {
                // debugger
                binding.value()
              } else {
                console.error(errors)
              }
            }
            break;
          case "confirm":
            el.onclick = function () {
              const expressions = Object.keys(expressionMap)
              const errors = [] as any
              expressions.forEach(expression => {
                expressionMap[expression].els.forEach(function (el) {
                  el.classList.add("v_required_submit")
                })
                if (expressionMap[expression].ins.filter(_in => {
                  if (_in.$el.classList.contains("el-checkbox-group")) {
                    return !(_in.value as any).length
                  } else {
                    return !_in.value
                  }
                }).length === expressionMap[expression].ins.length) {
                  errors.push(expression)
                }
              })
              if (errors.length === 0) {
                binding.value(Enum.ApprovalResult.Agree)
              } else {
                console.error(errors)
              }
            }
            break;
          default:
            if (!binding.value) {
              el.classList.add("v_required_error")
            }
            if (!expressionMap[expression]) {
              expressionMap[expression] = {
                els: [el],
                ins: [vnode.componentInstance as Input]
              }
            } else {
              expressionMap[expression].els.push(el)
              expressionMap[expression].ins.push(vnode.componentInstance as Input)
            }
            break;
        }
      },
      update(el, binding) {
        if (binding.value !== binding.oldValue) {
          if (!binding.oldValue) {
            el.classList.remove("v_required_error")
          }
          else if (!binding.value) {
            el.classList.add("v_required_error")
          }
        }
      },
      componentUpdated() { },
      unbind(el, binding) {
        delete expressionMap[binding.expression]
      },
    } as DirectiveOptions
  })())
  Object.keys(RouterConstant).forEach(key => {
    prototype[key] = RouterConstant[key]
  })
  prototype.Enum = Enum
  prototype.$attendanceException = (function () {
    const exceptions = ['迟到', '未打卡', '旷工', '下班未打卡'];
    return function (remark: string) {
      return exceptions.includes(remark)
    }
  })()
  initialCommit(prototype, store)
}

export default new App({
  entry, createStore, createRouter, beforeCreate
}).bootstrap() as any
