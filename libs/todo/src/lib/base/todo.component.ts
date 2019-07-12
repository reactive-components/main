import {
  AddTodo,
  RemoveTodo,
  ActionsUnion,
  ClearCompleted,
  ToggleAllCompleted,
  ToggleCompleted,
  SetFilter,
  getFilteredTodos,
  getFilter,
  TodoState,
  ITodo
} from '@reactive-components/store';
import { todoCss } from './todocss';
import { Action } from '@reactive-redux/store';
import { html } from 'lit-html';
import { BaseStore, ReactiveComponent } from '@reactive-components/utils';

export abstract class TodoComponent<S> extends ReactiveComponent<S, any> {
  abstract store: BaseStore<S, ActionsUnion>;
  abstract selectors;
  abstract styles;

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
          />
        </header>
        <section class="main">
          <input
            @click=${() => {
              this.store.dispatch(new ToggleAllCompleted());
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
                    ? this.store.dispatch(new SetFilter('all'))
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
                    ? this.store.dispatch(new SetFilter('active'))
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
                    ? this.store.dispatch(new SetFilter('completed'))
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
                    this.store.dispatch(new ClearCompleted());
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
                  this.store.dispatch(new ToggleCompleted({ id: todo.id }));
                }}
                id="todo-${index}"
                class="toggle"
                type="checkbox"
                ?checked=${todo.completed}
              />

              <label
                class=${todo.completed ? 'completed' : 'notdone'}
                for="todo-${index}"
              >
                ${todo.text}
              </label>
              <button
                @click=${() =>
                  this.store.dispatch(new RemoveTodo({ id: todo.id }))}
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
      this.store.dispatch(new AddTodo({ text: input.value }));

      input.value = '';
    }
  }
}

export function TodoComponentFactory<State, AU extends Action>(
  store: BaseStore<State, AU>,
  selectors: any[],
  styles: string[]
) {
  return class extends TodoComponent<State> {
    readonly store: BaseStore<State, AU>;
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

export function MyTodoFactory(store) {
  return TodoComponentFactory<TodoState, ActionsUnion>(
    store,
    [getFilteredTodos, getFilter],
    [todoCss]
  );
}
