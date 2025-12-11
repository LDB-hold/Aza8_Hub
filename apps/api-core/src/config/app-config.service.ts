import { Injectable } from '@nestjs/common';
import { loadApiConfig, ApiConfig } from '@aza8/config';

@Injectable()
export class AppConfigService {
  public readonly apiConfig: ApiConfig;

  constructor() {
    this.apiConfig = loadApiConfig();
  }
}
