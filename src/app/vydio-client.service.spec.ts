import { TestBed, inject } from '@angular/core/testing';

import { VydioClientService } from './vydio-client.service';

describe('VydioClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VydioClientService]
    });
  });

  it('should be created', inject([VydioClientService], (service: VydioClientService) => {
    expect(service).toBeTruthy();
  }));
});
