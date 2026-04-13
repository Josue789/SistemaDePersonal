import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoCard } from './empleado-card';

describe('EmpleadoCard', () => {
  let component: EmpleadoCard;
  let fixture: ComponentFixture<EmpleadoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
