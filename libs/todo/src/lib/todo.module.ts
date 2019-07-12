import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TodoComponent } from './todo.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule, TodoStore } from '@reactive-components/store';
import { MyTodoFactory } from './base/todo.component';

@NgModule({
  declarations: [TodoComponent],
  imports: [BrowserModule, CommonModule, StoreModule],
  exports: [TodoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [TodoComponent]
})
export class TodoModule {
  constructor(private store: TodoStore) {
    customElements.define('todo-component', MyTodoFactory(this.store));
  }
}
