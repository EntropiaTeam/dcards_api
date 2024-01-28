// eslint-disable-next-line max-classes-per-file
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  ContainerClient,
  BlockBlobClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  BlobBatchClient
} from '@azure/storage-blob';
import { Readable } from 'stream';
import { AppConfigService } from './app-config.service';

@Injectable()
export class StorageService {
  constructor(
    protected appConfigService: AppConfigService
  ) {}

  async getPdfBlobUrl(printibleID:string):Promise<string> {
    const { pdfContainerName } = this.appConfigService.storageConfig;
    const isExists = await this.isFileExist(pdfContainerName, printibleID);
    return isExists ? this.generateSecuredUri(printibleID, pdfContainerName) : '';
  }

  async isFileExist(containerName: string, fileName: string): Promise<boolean> {
    const blockBlobClient = this.getBlobClient(fileName, containerName);
    return blockBlobClient.exists();
  }

  async deleteIfExists(containerName: string, fileName: string): Promise<void> {
    const blockBlobClient = this.getBlobClient(fileName, containerName);
    await blockBlobClient.deleteIfExists();
  }

  async downloadBlobBuffer(containerName: string, fileName: string): Promise<Buffer> {
    const blockBlobClient = this.getBlobClient(fileName, containerName);
    return blockBlobClient.downloadToBuffer().catch((err: Error) => {
      // NOTE: `downloadToBuffer` error stack trace and message has
      // no useful info, probably because tsc runtime, so we need to rethrow
      throw new Error(
        `Cannot download blob. container = ${containerName}, filename = ${fileName}, stack=${err.stack || ''}`
      );
    });
  }

  async uploadFileToStorageService(
    stream: Readable,
    containerName: string,
    fileName: string
  ): Promise<void> {
    const ONE_MEGABYTE = 1024 * 1024;
    const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
    const blockBlobClient = this.getBlobClient(fileName, containerName);
    const blobContentType = containerName === this.appConfigService.storageConfig.pdfContainerName ? 'application/pdf' : 'image/jpeg';
    await blockBlobClient.uploadStream(
      stream,
      uploadOptions.bufferSize,
      uploadOptions.maxBuffers,
      { blobHTTPHeaders: { blobContentType } }
    );
  }

  generateSecuredUri(blobName: string, containerName: string): string {
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 60);
    const accountName = this.appConfigService.storageConfig.name;
    const accountKey = this.appConfigService.storageConfig.key;
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobSASSignatureValues = {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: startDate,
      expiresOn: expiryDate
    };
    const blobSAS = generateBlobSASQueryParameters(blobSASSignatureValues, sharedKeyCredential);
    return this.getBlobUrl(containerName, blobName, blobSAS.toString());
  }

  getBlobUrl(containerName: string, blobName: string, blobSAS?: string): string {
    const url = `${this.appConfigService.storageConfig.url}/${containerName}/${blobName}`;
    return blobSAS ? `${url}?${blobSAS}` : url;
  }

  async deleteOrderBlobs(id: string): Promise<void> {
    const key = this.buildSharedCredential();
    const blobBatchClient = this.getBlobBatchClient(key);
    const urls = [
      this.getBlobUrl(
        this.appConfigService.storageConfig.pdfContainerName,
        id
      ),
      this.getBlobUrl(
        this.appConfigService.storageConfig.customImagesContainerName,
        `${id}_thumb_front`
      ),
      this.getBlobUrl(
        this.appConfigService.storageConfig.customImagesContainerName,
        `${id}`
      )
    ];
    const { subResponsesFailedCount, subResponses } = await blobBatchClient.deleteBlobs(urls, key);

    if (subResponsesFailedCount > 0) {
      const errResponses = subResponses
        .filter((r) => r.status >= 400 && r.errorCode !== 'BlobNotFound');

      if (errResponses.length === 0) return;

      const status = errResponses.map((r) => `${r.errorCode || ''} ${r.statusMessage}`)
        .join(' ');
      throw new Error(`Some blob deletion failed. number = ${errResponses.length}, status = ${status}`);
    }
  }

  protected buildSharedCredential(): StorageSharedKeyCredential {
    const storageName = this.appConfigService.storageConfig.name;
    const storageKey = this.appConfigService.storageConfig.key;
    return new StorageSharedKeyCredential(
      storageName,
      storageKey
    );
  }

  protected getBlobBatchClient(key: StorageSharedKeyCredential): BlobBatchClient {
    const blobServiceClient: BlobServiceClient = new BlobServiceClient(
      this.appConfigService.storageConfig.url,
      key
    );
    return blobServiceClient.getBlobBatchClient();
  }

  protected getBlobClient(blobName: string, containerName: string): BlockBlobClient {
    const storageName = this.appConfigService.storageConfig.name;
    const storageKey = this.appConfigService.storageConfig.key;
    const sharedKeyCredential: StorageSharedKeyCredential = new StorageSharedKeyCredential(
      storageName,
      storageKey
    );
    const blobServiceClient: BlobServiceClient = new BlobServiceClient(
      this.appConfigService.storageConfig.url,
      sharedKeyCredential
    );
    const containerClient: ContainerClient = blobServiceClient.getContainerClient(containerName);
    return containerClient.getBlockBlobClient(blobName);
  }
}

export class StorageServiceLocal extends StorageService {
  async uploadFileToStorageService(
    stream: Readable,
    containerName: string,
    fileName: string
  ): Promise<void> {
    const file = fs.createWriteStream(path.resolve('data', `${containerName}-${fileName}`));
    const streamPipe = stream.pipe(file);
    await new Promise((resolve, reject) => {
      streamPipe.on('finish', resolve);
      streamPipe.on('error', reject);
    });
  }

  // download pdfs only created by yourself
  async downloadBlobBuffer(containerName: string, blobName: string): Promise<Buffer> {
    const { cardAssetsContainerName } = this.appConfigService.storageConfig;
    if (containerName === cardAssetsContainerName) {
      return super.downloadBlobBuffer(containerName, blobName);
    }

    const fileName = path.resolve('data', `${containerName}-${blobName}`);

    return new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });
  }

  async deleteOrderBlobs(id: string): Promise<void> {
    const pdfs = this.appConfigService.storageConfig.pdfContainerName;
    const customImages = this.appConfigService.storageConfig.customImagesContainerName;
    const errs: NodeJS.ErrnoException[] = [];

    function unlink(fileName: string): Promise<void> {
      return new Promise((resolve) => {
        fs.unlink(fileName, (err) => {
          if (err) errs.push(err);
          resolve();
        });
      });
    }

    await unlink(path.resolve('data', `${pdfs}-${id}`));
    await unlink(path.resolve('data', `${customImages}-${id}`));
    await unlink(path.resolve('data', `${customImages}-${id}_thumb_front`));

    const err = errs.find((e) => e.code !== 'ENOENT');
    if (err) throw err;
  }

  async isFileExist(containerName: string, fileName: string): Promise<boolean> {
    const filePath = path.resolve('data', `${containerName}-${fileName}`);

    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err && err.code === 'ENOENT') return resolve(false);
        if (err) return reject(err);
        return resolve(true);
      });
    });
  }
}
