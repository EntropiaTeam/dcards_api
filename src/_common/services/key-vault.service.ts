import { ConfigService } from '@nestjs/config';
import { DefaultAzureCredential } from '@azure/identity';
import { Injectable, Logger } from '@nestjs/common';
import { SecretClient } from '@azure/keyvault-secrets';

@Injectable()
export class KeyVaultService {
  private client: SecretClient;

  constructor(configService: ConfigService) {
    const keyVaultName = configService.get<string>('AZURE_KEYVAULT_NAME') || '';
    const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;

    this.client = new SecretClient(keyVaultUrl, new DefaultAzureCredential());
  }

  public async getSecret(key: string, defaultValue: boolean): Promise<string | undefined> {
    try {
      const secret = await this.client.getSecret(key);
      return secret.value;
    } catch (err) {
      const error = err as Error;
      if (!defaultValue) {
        Logger.warn(`Error in KeyVault Service: ${JSON.stringify(error.message)}`);
      }
      return undefined;
    }
  }
}
