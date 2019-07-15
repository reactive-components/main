import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  trigger,
  style,
  animate,
  transition,
  state
} from '@angular/animations';
import { ObservableEvent } from '@typebytes/ngx-template-streams';

@Component({
  selector: 'reactive-components-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeIn', [
      state(
        'void',
        style({
          opacity: '0'
        })
      ),
      state(
        'true',
        style({
          opacity: '1'
        })
      ),
      transition('void => true', animate(600))
    ])
  ]
})
export class AppComponent {
  public showLog = false;

  @ObservableEvent()
  public todoEvents$: Observable<any>;

  constructor() {
    // this.todoEvents$.subscribe(console.log);
  }
}
