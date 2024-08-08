import { Injectable } from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { randomUUID } from 'crypto';

export interface GeneratedApiKeyPayload {
  apiKey: string;
  hashedKey: string;
}

@Injectable()
export class ApiKeysService {
  constructor(private readonly hashingService: HashingService) {}

  async createAndHash(id: number): Promise<GeneratedApiKeyPayload> {
    const apiKey = this.generateApiKey(id);
    const hashedKey = await this.hashingService.hash(apiKey);
    return { apiKey, hashedKey };
  }

  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    const isValid = await this.hashingService.compare(apiKey, hashedKey);
    return isValid;
  }

  extractIdFromApiKey(apiKey: string): string {
    const decodedApiKey = Buffer.from(apiKey, 'base64').toString('ascii');
    const [id] = decodedApiKey.split(' ');
    return id;
  }

  private generateApiKey(id: number): string {
    const apiKey = `${id} ${randomUUID()}`;
    return Buffer.from(apiKey).toString('base64');
  }
}
