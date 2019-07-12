import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogComponent } from './log.component';
import { StoreModule, TodoStore } from '@reactive-components/store';
import { MyLogFactory } from './base/log.component';

@NgModule({
  imports: [CommonModule, StoreModule],
  declarations: [LogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [LogComponent],
  entryComponents: [LogComponent]
})
export class LogModule {
  constructor(private store: TodoStore) {
    customElements.define('log-component', MyLogFactory(this.store));
  }
}
