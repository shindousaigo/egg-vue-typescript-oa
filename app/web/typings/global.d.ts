import Vue from 'vue'
import { Dispatch, Commit, Getters } from "../page/oa/store/store";
import State from "../page/oa/store/state/index";


declare type BOOLEAN_BY_NUMBER = 0 | 1
declare type Or<T, R> = T | R

declare module 'vue/types/vue' {
  interface Vue {
    $hours: (h: number) => string
    $state: State
    $commit: Commit
    $getters: Getters
    $dispatch: Dispatch
    $language: string
    console: {
      log: (...args: any) => void
    }
  }
}
