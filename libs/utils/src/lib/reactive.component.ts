import {
  Action,
  select,
  fsa,
  action,
  guard,
  Creator
} from '@reactive-redux/store';
import { from, combineLatest, Subject, of, Observable } from 'rxjs';
import {
  switchMap,
  takeUntil,
  startWith,
  tap,
  debounceTime,
  share,
  filter,
  take
} from 'rxjs/operators';
import { render, TemplateResult } from 'lit-html';
import { BaseStore } from './base.store';

export const ACTION_PREFIX = '[Reactive component]';

export enum ReactiveActions {
  INIT = 'Init',
  RENDER = 'Render',
  DESTROY = 'Destroy',
  CSS_READY = 'CSS ready'
}

export interface BaseAction {
  component: HTMLElement;
}

export abstract class ReactiveComponent<
  State,
  ActionsUnion extends Action = any
> extends HTMLElement {
  private triggerRender$ = new Subject();
  private containerRef: HTMLDivElement;
  private slotRef: HTMLSlotElement;

  private _events$ = new Subject<Action>();
  public events$ = this._events$.pipe(share());

  private baseActionMap = new Map([
    [ReactiveActions.INIT, this.createAction(ReactiveActions.INIT)],
    [ReactiveActions.RENDER, this.createAction(ReactiveActions.RENDER)],
    [ReactiveActions.DESTROY, this.createAction(ReactiveActions.DESTROY)],
    [ReactiveActions.CSS_READY, this.createAction(ReactiveActions.CSS_READY)]
  ]);

  abstract readonly store: BaseStore<State, ActionsUnion> = new BaseStore();
  abstract readonly selectors: any = [state => state];
  abstract readonly styles: string[] = [];
  abstract render(selectedState: any[]): TemplateResult | TemplateResult[];

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.slotRef = document.createElement('slot');
    this.shadowRoot.appendChild(this.slotRef);

    this.containerRef = document.createElement('div');
    this.shadowRoot.appendChild(this.containerRef);

    this.events$.pipe(takeUntil(this.onDestroy$)).subscribe(ev => {
      this.dispatchEvent(
        new CustomEvent('rc-events', {
          detail: ev
        })
      );
    });
  }

  get onInit$() {
    return this.events$.pipe(
      filter(guard(this.baseActionMap.get(ReactiveActions.INIT)))
    );
  }

  get onDestroy$() {
    return this.events$.pipe(
      filter(guard(this.baseActionMap.get(ReactiveActions.DESTROY)))
    );
  }

  get onRender$() {
    return this.events$.pipe(
      filter(guard(this.baseActionMap.get(ReactiveActions.RENDER)))
    );
  }

  connectedCallback(timeout$: Observable<any> = of(0)) {
    this.emit(this.baseActionMap.get(ReactiveActions.INIT)());

    const attachCSS$ = () =>
      from(this.attachCSS()).pipe(
        tap(() =>
          this.emit(this.baseActionMap.get(ReactiveActions.CSS_READY)())
        )
      );

    const selectors$ = () =>
      combineLatest([
        ...this.selectors.map(selector =>
          this.store.state$.pipe(select(selector))
        )
      ]);

    timeout$
      .pipe(
        take(1),
        switchMap(() => this.triggerRender$.pipe(startWith(true))),
        debounceTime(50),
        switchMap(attachCSS$),
        switchMap(selectors$),
        takeUntil(this.onDestroy$),
        tap(() => this.emit(this.baseActionMap.get(ReactiveActions.RENDER)()))
      )
      .subscribe(this.__render.bind(this));
  }

  disconnectedCallback() {
    this.emit(this.baseActionMap.get(ReactiveActions.DESTROY)());
  }

  triggerRender() {
    this.triggerRender$.next(true);
  }

  emit(event) {
    this._events$.next(event);
  }

  createAction<T = any>(type: string): Creator & { type: string } {
    return action(`${ACTION_PREFIX} ${type}`, fsa<T>());
  }

  private attachCSS() {
    const addCss = (styleUrlOrCss: string) =>
      new Promise((resolve, reject) => {
        const isCSS = styleUrlOrCss.match(/^(#|\.)?[^{]+{/);

        if (isCSS) {
          const styleEl = document.createElement('style');
          styleEl.innerHTML = styleUrlOrCss;
          this.shadowRoot.insertBefore(styleEl, this.containerRef);
          resolve(true);
        } else {
          const link = document.createElement('link');
          link.type = 'text/css';
          link.rel = 'stylesheet';
          link.href = styleUrlOrCss;
          link.onload = () => resolve(true);
          link.onerror = () => reject();
          this.shadowRoot.insertBefore(link, this.containerRef);
        }
      });

    return Promise.all(this.styles.map(addCss));
  }

  private __render(state) {
    if (this.slotRef) {
      this.slotRef.remove();
    }

    render(this.render.bind(this)(state), this.containerRef);
  }
}
