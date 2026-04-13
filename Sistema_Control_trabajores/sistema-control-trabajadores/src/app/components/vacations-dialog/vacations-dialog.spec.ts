import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationsDialog } from './vacations-dialog';

describe('VacationsDialog', () => {
  let component: VacationsDialog;
  let fixture: ComponentFixture<VacationsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacationsDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(VacationsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
