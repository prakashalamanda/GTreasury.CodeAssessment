import { Component, Input, OnChanges } from '@angular/core';
import { NpvResponse } from '../../../../core/models/npv-response.model';

@Component({
  selector: 'app-npv-table-result',
  standalone: false,
  templateUrl: './npv-table-result.component.html',
  styleUrl: './npv-table-result.component.scss'
})
export class NpvTableResultComponent implements OnChanges {
  @Input() results: NpvResponse[] = [];

  pagedResults: NpvResponse[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  ngOnChanges(): void {
    this.currentPage = 1;
    this.updatePagedResults();
  }

  private updatePagedResults(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedResults = this.results.slice(start, end);
    this.totalPages = Math.ceil(this.results.length / this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagedResults();
  }
}
