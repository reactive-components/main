
import { ActionsUnion, AddTodo } from './actions';
import { addTodo, removeTodo, toggleCompleted, clearCompleted, toggleAllCompleted, setFilter, hideLogItem } from './reducers';
import { history } from './transducers';
import { Action } from '@reactive-redux/store';
import { Injectable } from '@angular/core';
import { BaseStore } from '@reactive-components/utils';

export type FilterTypes = 'all' | 'active' | 'completed';

export interface ITodo {
  id: string;
  text: string;
  completed: boolean;
}

export interface ILogItem {
  action: Action;
  timestamp: number;
  visible: boolean;
}

export interface TodoState {
  todos: {
    [id: string]: ITodo
  },
  log: {
    [timestamp: number]: ILogItem
  },
  filter: FilterTypes
}

@Injectable({
  providedIn: 'root'
})
export class TodoStore extends BaseStore<TodoState, ActionsUnion> {
  static readonly reducers = [
    addTodo,
    removeTodo,
    toggleCompleted,
    clearCompleted,
    toggleAllCompleted,
    setFilter,
    hideLogItem
  ];

  static readonly transducers = [history];

  static readonly initialState = {
    todos: {
      ['0']: { text: 'Buy a unicorn', id: '0', completed: true }
    },
    log: {
      1: {
        action: new AddTodo({ text: 'Buy a unicorn' }),
        visible: true,
        timestamp: 1
      }
    },
    filter: 'all'
  };

  constructor() {
    super({
      initialState: TodoStore.initialState,
      reducers: TodoStore.reducers,
      transducers: TodoStore.transducers
    })
  }
}
