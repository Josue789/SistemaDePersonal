import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewReportDialog } from './preview-report-dialog';

describe('PreviewReportDialog', () => {
  let component: PreviewReportDialog;
  let fixture: ComponentFixture<PreviewReportDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewReportDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewReportDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
