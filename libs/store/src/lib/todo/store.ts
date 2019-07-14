import { history } from './transducers';
import { Injectable } from '@angular/core';
import { BaseStore } from '@reactive-components/utils';
import { reducerFn, initialState } from './reducers';
import { addTodo } from './actions';
import { TodoState } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class TodoStore extends BaseStore<TodoState> {
  static readonly initialState: TodoState = initialState;
  static readonly reducer = reducerFn;
  static readonly transducers = [history];

  constructor() {
    super({
      initialState: TodoStore.initialState,
      reducer: TodoStore.reducer,
      transducers: TodoStore.transducers
    });
  }
}
