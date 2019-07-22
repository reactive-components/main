import { history } from './transducers';
import { Injectable } from '@angular/core';
import { BaseStore } from '@reactive-components/utils';
import { reducerFn } from './reducers';
import { TodoState } from './interfaces';
import { initialState } from './models';
import {
  addTodo,
  clearCompleted,
  toggleCompleted,
  toggleAllCompleted,
  setFilter,
  removeTodo,
  hideLogItem
} from './actions';
import { union } from 'ts-action';
import { Subject } from 'rxjs';

const actions = union(
  addTodo,
  clearCompleted,
  toggleCompleted,
  toggleAllCompleted,
  setFilter,
  removeTodo,
  hideLogItem
);

@Injectable({
  providedIn: 'root'
})
export class TodoStore extends BaseStore<TodoState, typeof actions> {
  static readonly initialState: TodoState = initialState;
  static readonly reducer = reducerFn;
  static readonly transducers = [history];

  constructor() {
    super({
      initialState: TodoStore.initialState,
      reducer: TodoStore.reducer,
      transducers: TodoStore.transducers,
      actionSubject: new Subject(),
      destroySubject: new Subject()
    });

    this.dispatch(addTodo({ text: 'Buy a unicorn', completed: true }));
  }
}
