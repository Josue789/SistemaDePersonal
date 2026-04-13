import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWorker } from './new-worker';

describe('NewWorker', () => {
  let component: NewWorker;
  let fixture: ComponentFixture<NewWorker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewWorker],
    }).compileComponents();

    fixture = TestBed.createComponent(NewWorker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
