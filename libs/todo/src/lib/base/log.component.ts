import { TodoState } from '../store/store';
import { ActionsUnion, HideLogItem } from '../store/actions';
import { getLog } from '../store/selectors';
import { Action, createSelector } from '@reactive-redux/store';
import { logCss } from './logcss';
import { html } from 'lit-html';
import { BaseStore, ReactiveComponent, formatDate } from '@reactive-components/utils';

export abstract class LogComponent<S, A extends Action> extends ReactiveComponent<
  S,
  A
> {
  abstract store: BaseStore<S, A>;
  abstract selectors;
  abstract styles;

  render([log]) {
    return html`
      ${log.map(item => {
        const hideAction = new HideLogItem({ timestamp: item.timestamp });

        if (item.action.type === hideAction.type) return html``;

        return html`
          <p>
            ${item.action.type} ${item.action.payload ? 'with' : ''}
            ${JSON.stringify(item.action.payload)}
            <small>at ${formatDate(item.timestamp)}</small>
          </p>
        `;
      })}
    `;
  }
}

export function LogComponentFactory<State, ActionsUnion extends Action>(
  store: BaseStore<State, ActionsUnion>,
  selectors: any[],
  styles: string[]
) {
  return class extends LogComponent<State, ActionsUnion> {
    store: BaseStore<State, ActionsUnion>;
    selectors: any[];
    styles: string[];

    constructor() {
      super();
      this.store = store;
      this.selectors = selectors;
      this.styles = styles;
    }
  };
}

export function MyLogFactory(store) {
  return class MyLastLogComponent extends LogComponentFactory<TodoState, ActionsUnion>(
    store,
    [getLog],
    logCss
  ) {
    styles = [
      ...this.styles,
      `
      :host {
        background-color: #9836187a;
        padding: 10px;
      }
      `
    ];

    selectors = this.getSelectors(this.itemsCount);

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
      return parseInt(this.getAttribute('items')) || Infinity;
    }

    render(log) {
      this.dispatchEvent(
        new CustomEvent('log-change', {
          detail: {
            log: log
          }
        })
      );

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
  };
}
