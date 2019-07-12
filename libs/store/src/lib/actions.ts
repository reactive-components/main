import { Action } from '@reactive-redux/store';
import { FilterTypes } from './store'

export class AddTodo extends Action {
  constructor(public payload: { text: string }) {
    super();
  }
}

export class RemoveTodo extends Action {
  constructor(public payload: { id: string }) {
    super();
  }
}

export class ToggleCompleted extends Action {
  constructor(public payload: { id: string }) {
    super();
  }
}

export class ToggleAllCompleted extends Action {}
export class ClearCompleted extends Action {}

export class SetFilter extends Action {
  constructor(public payload: FilterTypes) {
    super();
  }
}

export class HideLogItem extends Action {
  constructor(public payload: { timestamp: number }) {
    super();
  }
}

export type ActionsUnion = AddTodo | RemoveTodo | ToggleCompleted | ToggleAllCompleted | ClearCompleted | SetFilter | HideLogItem;