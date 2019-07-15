import { produce } from 'immer';
import { TodoState } from './interfaces';
import { reducer, on } from '@reactive-redux/store';
import {
  addTodo,
  clearCompleted,
  hideLogItem,
  removeTodo,
  setFilter,
  toggleAllCompleted,
  toggleCompleted
} from './actions';
import { initialState } from './models';

export const reducerFn = reducer<TodoState>(
  initialState,
  on(addTodo, (state, { payload }) =>
    produce(state, draft => {
      const { text, completed } = payload;

      const id = crypto.getRandomValues(new Uint8Array(8)).join('');
      draft.todos[id] = {
        id,
        text,
        completed: !!completed
      };
    })
  ),
  on(removeTodo, (state: TodoState, { payload }) =>
    produce(state, draft => {
      const { id } = payload;

      delete draft.todos[id];
    })
  ),
  on(toggleCompleted, (state: TodoState, { payload }) =>
    produce(state, draft => {
      const { id } = payload;

      if (!state.todos[id]) return;

      draft.todos[id].completed = !state.todos[id].completed;
    })
  ),
  on(toggleAllCompleted, state =>
    produce(state, draft => {
      const todos = Object.keys(draft.todos).map(key => draft.todos[key]);
      const hasTodo = todos.some(todo => !todo.completed);

      todos.forEach(todo => {
        todo.completed = hasTodo;
      });
    })
  ),
  on(clearCompleted, state =>
    produce(state, draft => {
      Object.keys(draft.todos).forEach(key => {
        if (draft.todos[key].completed) {
          delete draft.todos[key];
        }
      });
    })
  ),
  on(setFilter, (state, { payload }) =>
    produce(state, draft => {
      const { filter } = payload;

      draft.filter = filter;
    })
  ),
  on(hideLogItem, (state, { payload }) =>
    produce(state, draft => {
      const { timestamp } = payload;

      draft.log[timestamp].visible = false;
    })
  )
);
