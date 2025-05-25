import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpvTableResultComponent } from './npv-table-result.component';
import { FormsModule } from '@angular/forms';
import { NpvResponse } from '../../../../core/models/npv-response.model';

describe('NpvTableResultComponent', () => {
  let component: NpvTableResultComponent;
  let fixture: ComponentFixture<NpvTableResultComponent>;

   const mockResults: NpvResponse[] = Array.from({ length: 12 }, (_, i) => ({
    discountRate: i + 1,
    netPresentValue: (i + 1) * 1000
  } as NpvResponse));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NpvTableResultComponent],
      imports: [FormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NpvTableResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentPage and update pagedResults on ngOnChanges', () => {
    component.results = mockResults;
    component.currentPage = 5; // intentionally set to non-1 to verify reset
    component.ngOnChanges();
    expect(component.currentPage).toBe(1);
    expect(component.pagedResults.length).toBe(component.pageSize);
    expect(component.totalPages).toBe(Math.ceil(mockResults.length / component.pageSize));
  });

  it('should update pagedResults correctly for first page', () => {
    component.results = mockResults;
    component.currentPage = 1;
    component['updatePagedResults']();
    expect(component.pagedResults.length).toBe(component.pageSize);
    expect(component.pagedResults[0].discountRate).toBe(1);
  });

  it('should update pagedResults correctly for middle page', () => {
    component.results = mockResults;
    component.currentPage = 2;
    component['updatePagedResults']();
    expect(component.pagedResults.length).toBe(component.pageSize);
    expect(component.pagedResults[0].discountRate).toBe(6);
  });

  it('should update pagedResults correctly for last page with less items', () => {
    component.results = mockResults;
    component.currentPage = 3;
    component['updatePagedResults']();
    expect(component.pagedResults.length).toBe(2); // 12 total, so last page has 2 items
    expect(component.pagedResults[0].discountRate).toBe(11);
  });

  it('should change page when goToPage is called and update pagedResults', () => {
    component.results = mockResults;
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.pagedResults[0].discountRate).toBe(6);
  });
});
