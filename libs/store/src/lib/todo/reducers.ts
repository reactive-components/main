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

export const initialState: TodoState = {
  todos: {
    ['0']: { text: 'Buy a unicorn', id: '0', completed: true }
  },
  log: {
    1: {
      action: addTodo({ text: 'Buy a unicorn' }),
      visible: true,
      timestamp: 1
    }
  },
  filter: 'all'
};

export const reducerFn = reducer<TodoState>(
  initialState,
  on(addTodo, (state, { payload }) => {
    const { text } = payload;

    return produce(state, draft => {
      const id = crypto.getRandomValues(new Uint8Array(8)).join('');
      draft.todos[id] = {
        id,
        text,
        completed: false
      };
    });
  }),
  on(removeTodo, (state: TodoState, { payload }) => {
    const { id } = payload;

    return produce(state, draft => {
      delete draft.todos[id];
    });
  }),
  on(toggleCompleted, (state: TodoState, { payload }) => {
    const { id } = payload;

    return produce(state, draft => {
      draft.todos[id].completed = !state.todos[id].completed;
    });
  }),
  on(toggleAllCompleted, state => {
    return produce(state, draft => {
      const todos = Object.keys(draft.todos).map(key => draft.todos[key]);
      const hasTodo = todos.some(todo => !todo.completed);

      todos.forEach(todo => {
        todo.completed = hasTodo;
      });
    });
  }),
  on(clearCompleted, state => {
    return produce(state, draft => {
      Object.keys(draft.todos).forEach(key => {
        if (draft.todos[key].completed) {
          delete draft.todos[key];
        }
      });
    });
  }),
  on(setFilter, (state, { payload }) => {
    const { filter } = payload;

    return produce(state, draft => {
      draft.filter = filter;
    });
  }),
  on(hideLogItem, (state, { payload }) => {
    const { timestamp } = payload;

    return produce(state, draft => {
      draft.log[timestamp].visible = false;
    });
  })
);
