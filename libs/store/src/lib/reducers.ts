import { produce } from 'immer';
import { TodoState } from './store';
import { AddTodo, RemoveTodo, ToggleAllCompleted, ToggleCompleted, ClearCompleted, SetFilter, HideLogItem } from './actions'

export function addTodo(state: TodoState, { payload }: AddTodo) {
  const { text } = payload;
  return produce(state, draft => {
    const id = crypto.getRandomValues(new Uint8Array(8)).join("");
    draft.todos[id] = {
      id,
      text,
      completed: false,
    }
  });
}

export function removeTodo(state: TodoState, { payload }: RemoveTodo) {
  const { id } = payload;
  return produce(state, draft => {
    delete draft.todos[id];
  });
}

export function toggleCompleted(state: TodoState, { payload }: ToggleCompleted) {
  const { id } = payload;

  return produce(state, draft => {  
    draft.todos[id].completed = !state.todos[id].completed;
  });
}

export function toggleAllCompleted(state: TodoState, action: ToggleAllCompleted) {
  return produce(state, draft => {
    const todos = Object.keys(draft.todos).map(key => draft.todos[key]);
    const hasTodo = todos.some(todo => !todo.completed);
    
    todos.forEach(todo => {
      todo.completed = hasTodo;
    });
  });
}

export function clearCompleted(state: TodoState, action: ClearCompleted) {
  return produce(state, draft => {
    Object.keys(draft.todos).forEach(key => {
      if (draft.todos[key].completed) {
        delete draft.todos[key];
      }
    });
  });
}

export function setFilter(state: TodoState, { payload }: SetFilter) {
  return produce(state, draft => {
    draft.filter = payload;
  });
}

export function hideLogItem(state: TodoState, { payload }: HideLogItem) {
  const { timestamp } = payload;
  return produce(state, draft => {
    draft.log[timestamp].visible = false;
  });
}