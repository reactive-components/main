import { Action, action, fsa } from '@reactive-redux/store';
import { FilterTypes } from './interfaces';

export enum TodoActions {
  ADD_TODO = '[Todo] Add Todo',
  REMOVE_TODO = '[Todo] Remove Todo',
  TOGGLE_COMPLETED = '[Todo] Toggle completed',
  TOGGLE_ALL_COMPLETED = '[Todo] Toggle all completed',
  CLEAR_COMPLETED = '[Todo] Clear completed items',
  SET_FILTER = '[Todo] Set filter',
  HIDE_LOG_ITEM = '[Todo] Hide log item'
}

const fsaID = fsa<{ id: string }>();

export const addTodo = action(TodoActions.ADD_TODO, fsa<{ text: string }>());
export const removeTodo = action(TodoActions.REMOVE_TODO, fsaID);
export const toggleCompleted = action(TodoActions.TOGGLE_COMPLETED, fsaID)
export const toggleAllCompleted = action(TodoActions.TOGGLE_ALL_COMPLETED);
export const clearCompleted = action(TodoActions.CLEAR_COMPLETED);
export const setFilter = action(TodoActions.SET_FILTER, fsa<{ filter: FilterTypes }>());
export const hideLogItem = action(TodoActions.HIDE_LOG_ITEM, fsa<{ timestamp: number }>());
