import { TestBed } from '@angular/core/testing';

import { LoadingInicialService } from './loading-inicial.service';

describe('LoadingInicialService', () => {
  let service: LoadingInicialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingInicialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
