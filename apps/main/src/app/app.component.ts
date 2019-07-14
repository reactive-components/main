import { Component } from '@angular/core';
import { MainStore } from '@reactive-components/store';
import { MyTodoFactory } from '@reactive-components/todo';
import { MyLogFactory } from '@reactive-components/log';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'reactive-components-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public showLog = false;

  public todoStore$ = this.store.state$.pipe(map(({ todo }) => todo));

  constructor(private store: MainStore) {
    this.todoStore$.pipe(first()).subscribe(store => {
      customElements.define('todo-component', MyTodoFactory(store));
      customElements.define('log-component', MyLogFactory(store));
    });
  }
}
