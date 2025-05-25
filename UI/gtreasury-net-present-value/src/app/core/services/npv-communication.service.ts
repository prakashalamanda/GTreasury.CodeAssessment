import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NpvRequest } from '../models/npv-request.model';

@Injectable({
  providedIn: 'root'
})
export class NpvCommunicationService {

  private calculateSubject = new BehaviorSubject<NpvRequest | null>(null);
  calculate$ = this.calculateSubject.asObservable();

  private resetSubject = new BehaviorSubject<boolean>(false);
  reset$ = this.resetSubject.asObservable();

  sendCalculateRequest(request: NpvRequest) {
    this.calculateSubject.next(request);
  }

  sendResetEvent() {
    this.resetSubject.next(true);
  }

  clearResetEvent() {
    this.resetSubject.next(false);
  }
}
