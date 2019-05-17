import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TodoComponent } from './todo.component';
import { TodoStore } from './store/store';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [TodoComponent],
  imports: [BrowserModule, CommonModule],
  exports: [TodoComponent],
  providers: [TodoStore],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [TodoComponent]
})
export class TodoModule {}
