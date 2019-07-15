import { history } from './transducers';
import { Injectable } from '@angular/core';
import { BaseStore } from '@reactive-components/utils';
import { reducerFn } from './reducers';
import { TodoState } from './interfaces';
import { initialState } from './models';
import { addTodo } from './actions';

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

    this.dispatch(addTodo({ text: 'Buy a unicorn', completed: true }))
  }
}
