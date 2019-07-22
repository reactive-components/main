import { Action, createSelector } from '@reactive-redux/store';
import { logCss } from './logcss';
import { html } from 'lit-html';
import {
  BaseStore,
  ReactiveComponent,
  formatDate
} from '@reactive-components/utils';
import { TodoState, getLog, hideLogItem, TodoStore } from '@reactive-components/store';

export interface LogItem {
  action: Action & { payload: any };
  visible: boolean;
  timestamp: number;
}

export abstract class LogComponent<
  S,
  A extends Action = any
> extends ReactiveComponent<S, A> {
  abstract readonly store: BaseStore<S>;
  abstract readonly selectors;
  abstract readonly styles;

  render([log]: [LogItem[]]) {
    return html`
      ${log
        .map(item => {
          const hideAction: any = hideLogItem({
            timestamp: item.timestamp
          });

          if (!item.visible) return;

          return html`
            <p @click="${() => this.store.dispatch(hideAction)}">
              ${item.action.type} ${item.action.payload ? 'with' : ''}
              ${JSON.stringify(item.action.payload)}
              <br />
              <small>at ${formatDate(item.timestamp)}</small>
            </p>
          `;
        })
        .filter(l => !!l)}
    `;
  }
}

export function LogComponentFactory<State>(
  store: BaseStore<State>,
  selectors: any[],
  styles: string[]
) {
  return class extends LogComponent<State> {
    readonly store = store;
    readonly selectors = selectors;
    readonly styles = styles;
  };
}

export function MyLogFactory(store = new TodoStore(), selectors = [getLog], styles = [logCss]) {
  class MyLastLogComponent extends LogComponentFactory<TodoState>(
    store,
    selectors,
    styles
  ) {
    public selectors = this.getSelectors(this.itemsCount);

    static get observedAttributes() {
      return ['items'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'items') {
        this.selectors = this.getSelectors(parseInt(newValue, 10));
        super.triggerRender();
      }
    }

    get itemsCount() {
      return parseInt(this.getAttribute('items'), 10) || Infinity;
    }

    render(log) {
      return html`
        ${this.itemsCount !== Infinity
          ? html`
              Last ${this.itemsCount !== 1 ? this.itemsCount : ''}
              change${this.itemsCount !== 1 ? 's' : ''}:
            `
          : html`
              Complete log:
            `}
        ${super.render(log)}
      `;
    }

    getSelectors(n: number = 5) {
      return [
        createSelector(
          getLog,
          log => log.slice(-n)
        )
      ];
    }
  }

  customElements.define('log-component', MyLastLogComponent);

  return customElements.whenDefined('log-component').then(() => customElements.get('log-component'))
}
