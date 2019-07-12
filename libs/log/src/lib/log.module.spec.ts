import { async, TestBed } from '@angular/core/testing';
import { LogModule } from './log.module';

describe('LogModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LogModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(LogModule).toBeDefined();
  });
});
