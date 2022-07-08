import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThirdPartyService {
  getDataFromPromise(): Promise<string> {
    return Promise.resolve('test');
  }

  getDataFromObservable(): Observable<string> {
    return of('test');
  }
}

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private readonly service: ThirdPartyService) {}

  getUserInfo(): Observable<string> {
    return from(this.service.getDataFromPromise());
  }

  getUserInfo2(): Observable<string> {
    return this.service.getDataFromObservable();
  }
}
