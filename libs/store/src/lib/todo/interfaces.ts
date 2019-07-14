import { Action } from '@reactive-redux/store';

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
    [id: string]: ITodo;
  };
  log: {
    [timestamp: number]: ILogItem;
  };
  filter: FilterTypes;
}
