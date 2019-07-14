import { Component } from '@angular/core';
import { MainStore, TodoStore } from '@reactive-components/store';
import { MyTodoFactory } from '@reactive-components/todo';
import { MyLogFactory } from '@reactive-components/log';
import { map, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'reactive-components-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: '0'
      })),
      state('true', style({
        opacity: '1'
      })),
      transition('void => true', animate(1000))
    ])
  ]
})
export class AppComponent {
  public showLog = false;

  public todoStore$: Observable<TodoStore>;

  constructor(private store$: MainStore) {
    this.todoStore$ = this.store$.state$.pipe(map(({ todo }) => todo));

    this.todoStore$.pipe(first()).subscribe(store => {
      customElements.define('todo-component', MyTodoFactory(store));
      customElements.define('log-component', MyLogFactory(store));
    });
  }
}
