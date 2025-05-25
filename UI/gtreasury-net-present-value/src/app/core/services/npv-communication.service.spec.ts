import { TestBed } from '@angular/core/testing';
import { NpvCommunicationService } from './npv-communication.service';
import { NpvRequest } from '../models/npv-request.model';
import { skip, take } from 'rxjs';

describe('NpvCommunicationService', () => {
  let service: NpvCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NpvCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit a calculation request', (done) => {
    const request: NpvRequest = {
      cashFlows: [100, 200, 300],
      lowerBoundRate: 5,
      upperBoundRate: 15,
      incrementRate: 1
    };

    service.calculate$.pipe(skip(1), take(1)).subscribe((value) => {
      expect(value).toEqual(request);
      done();
    });

    service.sendCalculateRequest(request);
  });

  it('should emit true on reset event', (done) => {
    service.reset$.subscribe(value => {
      if (value === true) {
        expect(value).toBeTrue();
        done();
      }
    });

    service.sendResetEvent();
  });

  it('should emit false on clearResetEvent', (done) => {
    service.reset$.pipe(skip(1), take(1)).subscribe((value) => {
      expect(value).toBeFalse();
      done();
    });

    service.clearResetEvent();
  });
});
