import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core'

@Component({
  selector: 'rc-log',
  template: `
    <log-component items="5">loading log...</log-component>
  `,
  styles: [
    `
      * {
        font-family: monospace;
      }

      log-component {
        width: 100%;
      }
    `
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogComponent implements OnInit {
  ngOnInit() {}
}
