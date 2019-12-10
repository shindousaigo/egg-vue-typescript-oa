import Vue from 'vue'
import { Dispatch, Commit, Getters } from "../page/oa/store/store";
import State from "../page/oa/store/state/index";
import { Enum as _enum } from "../page/oa/store/actions";
import { Const } from "../page/oa/router/const";

declare type RC = {
  [key in keyof typeof Const]: typeof Const[key]
}
declare type BOOLEAN_BY_NUMBER = 0 | 1
declare type Or<T, R> = T | R

declare module 'vue/types/vue' {
  interface Vue extends RC {
    $hours: (h: number) => string
    $state: State
    $commit: Commit
    $getters: Getters
    $dispatch: Dispatch
    $language: string
    console: {
      log: (...args: any) => void
      info: (...args: any) => void
    }
    Enum: typeof _enum
    $attendanceException(remark: string): boolean
  }
}
