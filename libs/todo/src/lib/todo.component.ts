import {
  Component,
  OnInit,
  ViewEncapsulation,
  NgZone,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  Injector
} from '@angular/core';
import { MyLogFactory } from './base/log.component';
import { MyTodoFactory } from './base/todo.component';
import { TodoStore } from './store/store';

@Component({
  selector: 'rc-todo',
  template: `
    <div class="row">
      <todo-component>loading todo...</todo-component>
    </div>
    <div class="row">
      <last-log #lastLog [attr.items]="items">loading log...</last-log>
    </div>
  `,
  styles: [
    `
      * {
        font-family: monospace;
      }

      .row {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
      }

      todo-component {
        width: 100%;
      }

      last-log {
        width: 50%;
      }
    `
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  private logComponentFactory;
  private todoComponentFactory;
  private _items = 5;

  @Input()
  get items() {
    return this._items;
  }
  set items(value: number) {
    this._items = value;
    this.cdRef.markForCheck();
  }

  @Input() public showLog;

  @Output() public logChange = new EventEmitter();

  @ViewChild('lastLog') public lastLog;

  constructor(
    private store: TodoStore,
    private injector: Injector,
    private cdRef: ChangeDetectorRef
  ) {
    this.todoComponentFactory = MyTodoFactory(this.store);
    customElements.define('todo-component', this.todoComponentFactory);

    this.logComponentFactory = MyLogFactory(this.store);
    customElements.define('last-log', this.logComponentFactory);

    this.store.actions$.subscribe(console.log);
  }

  ngOnInit() {}

  // ngAfterViewInit(): void {
  //   if (this.showLog) {
  //     setTimeout(() => {
  //       console.log(this.showLog, this.lastLog);
  //     }, 150);

  //     console.log(this.showLog, this.lastLog);
  //     // this.lastLog.nativeElement.addEventListener('log-change', this.handler.bind(this));
  //   }
  // }

  // ngOnDestroy(): void {
  //   if (this.showLog) {
  //     this.lastLog.nativeElement.removeEventListener(
  //       'log-change',
  //       this.handler.bind(this)
  //     );
  //   }
  // }

  // private handler({ detail }) {
  //   const { log } = detail;
  //   this.logChange.emit(...log);
  // }
}
