import State from "./state"
import Actions, { ActionsMethods } from "./actions"
import Getters, { GettersMethods } from "./getters"

export type Commit = {
  [key in keyof State]: (data: State[key]) => void;
}

export type Dispatch = {
  [key in keyof Actions[ActionsMethods]]: Actions[ActionsMethods][key];
}

export type Getters = {
  [key in keyof Getters[GettersMethods]]: Getters[GettersMethods][key]
}