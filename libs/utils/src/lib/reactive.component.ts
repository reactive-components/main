import { Store, Action, select } from '@reactive-redux/store';
import { from, combineLatest, BehaviorSubject, Subject } from 'rxjs';
import { delay, switchMap, takeUntil } from 'rxjs/operators';
import { render, TemplateResult } from 'lit-html';

export abstract class ReactiveComponent<
  State,
  ActionsUnion extends Action = any
> extends HTMLElement {
  private triggerSubject = new BehaviorSubject(true);
  private containerRef: HTMLDivElement;
  private slotRef: HTMLSlotElement;
  private destroy$ = new Subject<boolean>();
  public contentId: string;

  abstract readonly store: Store<State, ActionsUnion> = new Store();
  abstract readonly selectors: any = [state => state];
  abstract readonly styles: string[] = [];
  abstract render(selectedState: any[]): TemplateResult | TemplateResult[];

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.slotRef = document.createElement('slot');
    this.shadowRoot.appendChild(this.slotRef);

    this.containerRef = document.createElement('div');
    this.contentId = getComponentId();
    this.containerRef.id = this.contentId;
    this.shadowRoot.appendChild(this.containerRef);
  }

  connectedCallback(timeout: number = 0) {
    const attachCSS = () => from(this.attachCSS());

    this.triggerSubject
      .pipe(
        switchMap(attachCSS),
        delay(timeout),
        switchMap(() =>
          combineLatest([
            ...this.selectors.map(selector =>
              this.store.state$.pipe(select(selector))
            )
          ])
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(this.__render.bind(this));
  }

  disconnectedCallback() {
    this.destroy$.next(true);
  }

  triggerRender() {
    this.triggerSubject.next(true);
  }

  attachCSS() {
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

function getComponentId() {
  return `reactive-component-${crypto
    .getRandomValues(new Uint8Array(8))
    .join('')}`;
}
