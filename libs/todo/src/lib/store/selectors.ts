import { createSelector } from '@reactive-redux/store';
import { TodoState, ITodo, ILogItem, FilterTypes } from './store';

export const getFilter = createSelector<TodoState, FilterTypes, FilterTypes>(state => state.filter, filter => filter);

export const getTodos = createSelector<TodoState, { [key: string]: ITodo }, ITodo[]>(
  state => state.todos,
  todos => Object.values(todos)
);

export const getFilteredTodos = createSelector(getFilter, getTodos, (filter, todos) => {
  if (!todos) return [];

  return filter === 'all' ?
    todos :
    filter === 'active' ?
      todos.filter(todo => !todo.completed) :
      todos.filter(todo => todo.completed)
});

export const getLog = createSelector<TodoState, { [key: number]: ILogItem }, ILogItem[]>(state => state.log, log => Object.values(log));

