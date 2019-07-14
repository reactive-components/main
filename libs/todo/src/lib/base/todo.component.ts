import {
  getFilteredTodos,
  getFilter,
  TodoState,
  ITodo,
  addTodo,
  toggleAllCompleted,
  toggleCompleted,
  hideLogItem,
  clearCompleted,
  setFilter,
  removeTodo
} from '@reactive-components/store';
import { todoCss } from './todocss';
import { html } from 'lit-html';
import { BaseStore, ReactiveComponent } from '@reactive-components/utils';

export abstract class TodoComponent<S> extends ReactiveComponent<S> {
  abstract readonly store: BaseStore<S>;
  abstract readonly selectors;
  abstract readonly styles;

  render([todos, filter]) {
    return html`
      <section class="todoapp">
        <header class="header">
          <h1>todos</h1>
          <input
            @keydown=${event => this.handleEnter(event)}
            class="new-todo"
            placeholder="What needs to be done?"
            autofocus
            aria-label="Todo input field"
          />
        </header>
        <section class="main">
          <input
            @click=${() => {
              this.store.dispatch(toggleAllCompleted());
            }}
            id="toggle-all"
            class="toggle-all"
            type="checkbox"
          />
          <label for="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            ${this.generateTodos(todos)}
          </ul>
        </section>

        <footer class="footer">
          <span class="todo-count">
            <strong>${todos.filter(todo => !todo.completed).length}</strong>
            item left
          </span>

          <ul class="filters">
            <li>
              <a
                @click=${() =>
                  filter !== 'all'
                    ? this.store.dispatch(setFilter({ filter: 'all' }))
                    : null}
                class="${filter === 'all' ? 'selected' : ''}"
                href="#/"
              >
                All
              </a>
            </li>
            <li>
              <a
                @click=${() =>
                  filter !== 'active'
                    ? this.store.dispatch(setFilter({ filter: 'active' }))
                    : null}
                href="#/active"
                class="${filter === 'active' ? 'selected' : ''}"
              >
                Active
              </a>
            </li>
            <li>
              <a
                @click=${() =>
                  filter !== 'completed'
                    ? this.store.dispatch(setFilter({ filter: 'completed' }))
                    : null}
                href="#/completed"
                class="${filter === 'completed' ? 'selected' : ''}"
              >
                Completed
              </a>
            </li>
          </ul>
          ${todos.some(todo => todo.completed)
            ? html`
                <button
                  @click=${() => {
                    this.store.dispatch(clearCompleted());
                  }}
                  class="clear-completed"
                >
                  Clear completed
                </button>
              `
            : html``}
        </footer>
      </section>
    `;
  }

  private generateTodos(todos: ITodo[]) {
    return todos.map(
      (todo, index) =>
        html`
          <li class="${todo.completed ? 'completed' : ''}">
            <div class="view">
              <input
                @click=${event => {
                  this.store.dispatch(toggleCompleted({ id: todo.id }));
                }}
                id="todo-${index}"
                class="toggle"
                type="checkbox"
                ?checked=${todo.completed}
                aria-label="todo checked toggle"
              />

              <label
                class=${todo.completed ? 'completed' : 'notdone'}
                for="todo-${index}"
              >
                ${todo.text}
              </label>
              <button
                @click=${() =>
                  this.store.dispatch(removeTodo({ id: todo.id }))}
                class="destroy"
              ></button>
            </div>
          </li>
        `
    );
  }

  private handleEnter(event) {
    const input: any = this.shadowRoot.querySelector('.new-todo');

    if (event.keyCode === 13 && !!input.value) {
      this.store.dispatch(addTodo({ text: input.value }));

      input.value = '';
    }
  }
}

export function TodoComponentFactory<State>(
  store: BaseStore<State>,
  selectors: any[],
  styles: string[]
) {
  return class extends TodoComponent<State> {
    readonly store: BaseStore<State>;
    readonly selectors: any[];
    readonly styles: string[];

    constructor() {
      super();
      this.store = store;
      this.selectors = selectors;
      this.styles = styles;
    }
  };
}

export function MyTodoFactory(
  store,
  selectors = [getFilteredTodos, getFilter],
  styles = [todoCss]
) {
  return TodoComponentFactory<TodoState>(
    store,
    selectors,
    styles
  );
}
