import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NpvRequest } from '../models/npv-request.model';
import { NpvResponse } from '../models/npv-response.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NpvCalculatorService {
  private readonly apiUrl = `${environment.apiUrl}/api/npv/calculate`;

  constructor(private http: HttpClient) {}

  calculateNpv(request: NpvRequest): Observable<NpvResponse[]> {
    return this.http.post<NpvResponse[]>(this.apiUrl, request);
  }
}