/* eslint-disable max-classes-per-file */
import {
  Injectable
} from '@nestjs/common';
import * as appInsightsSdk from 'applicationinsights';
import { DependencyTelemetry, Identified } from 'applicationinsights/out/Declarations/Contracts';
import { AppConfigService } from './app-config.service';

@Injectable()
export class AzureService {
  appInsights: appInsightsSdk.TelemetryClient;

  constructor(
    private appConfigService: AppConfigService
  ) {
    if (this.appConfigService.azureTrackConfig.trackLocally) {
      this.appInsights = appInsightsSdk.defaultClient;
      return;
    }

    const key = this.appConfigService.azureTrackConfig.appinsightsInstrumentationkey;
    appInsightsSdk.setup(key)
      .setSendLiveMetrics(true)
      .start();
    this.appInsights = appInsightsSdk.defaultClient;
  }

  trackException(error: Error): void {
    this.appInsights.trackException({ exception: error });
  }

  trackMetric(name: string, value: number): void {
    this.appInsights.trackMetric({ name, value });
  }

  trackEvent(event: appInsightsSdk.Contracts.EventTelemetry): void {
    this.appInsights.trackEvent(event);
  }

  trackDependency(dependency: DependencyTelemetry & Identified): void {
    this.appInsights.trackDependency(dependency);
  }
}

export class AzureServiceLocal {
  constructor(private appConfigService: AppConfigService) {}

  trackException(error: Error): void {
    console.log('AzureService: ', error); // eslint-disable-line no-console
  }

  trackMetric(name: string, value: number): void {
    // eslint-disable-next-line no-console
    console.log(`Track metric: name = ${name}, value = ${value}`);
  }

  trackEvent(event: appInsightsSdk.Contracts.EventTelemetry): void {
    // eslint-disable-next-line no-console
    console.log('AzureService: ', event);
  }
}
