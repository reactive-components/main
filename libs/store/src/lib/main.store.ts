import { Injectable } from '@angular/core';
import { BaseStore } from '@reactive-components/utils';
import { TodoStore } from './todo';
import { reducer } from '@reactive-redux/store';

export interface IMainStore {
  todo: TodoStore
}

@Injectable({
  providedIn: 'root'
})
export class MainStore extends BaseStore<IMainStore> {
  static readonly initialState: IMainStore = {
    todo: new TodoStore()
  };

  static readonly reducer = reducer<IMainStore>(MainStore.initialState);

  constructor() {
    super({
      initialState: MainStore.initialState,
      reducer: MainStore.reducer
    });
  }
}
