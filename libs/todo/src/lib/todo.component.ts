import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'rc-todo',
  template: `
    <todo-component>loading todo...</todo-component>
  `,
  styles: [
    `
      * {
        font-family: monospace;
      }

      todo-component {
        width: 100%;
      }
    `
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {}
