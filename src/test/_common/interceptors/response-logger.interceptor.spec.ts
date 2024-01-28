/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Test, TestingModule } from '@nestjs/testing';
import { tap } from 'rxjs/operators';
import { ResponseLoggerInterceptor } from '../../../_common/interceptors/response-logger.interceptor';
import { AppConfigService } from '../../../_common/services/app-config.service';
import { AzureService } from '../../../_common/services/azure.service';
import { CallHandlerFake } from '../fake/call-handler.fake';

class Context extends ExecutionContextHost {
  getResponse = jest.fn().mockReturnThis();

  switchToHttp = jest.fn().mockReturnThis();

  getClass = jest.fn().mockReturnValue({ name: 'TestController' });

  getHandler = jest.fn().mockReturnValue({ name: 'findAll' });

  getHeaders = jest.fn().mockReturnValue({});
}

const mockAppConfig = {
  get azureTrackConfig() { return {}; }
};

describe('ResponseLoggerInterceptor', () => {
  let interceptor: ResponseLoggerInterceptor;
  let telemetry: AzureService;
  let appConfigService: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseLoggerInterceptor,
        {
          provide: AzureService,
          useValue: { trackDependency() {} }
        },
        {
          provide: AppConfigService,
          useValue: mockAppConfig
        }
      ]
    })
      .compile();

    interceptor = module.get(ResponseLoggerInterceptor);
    telemetry = module.get(AzureService);
    appConfigService = module.get(AppConfigService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Expected: Defined', () => {
    expect(interceptor)
      .toBeDefined();
  });

  it('Expected: Correct instance', () => {
    expect(interceptor)
      .toBeInstanceOf(ResponseLoggerInterceptor);
  });

  it('When: Logging enabled. Expected: Responses are logged', () => {
    jest
      .spyOn(appConfigService, 'azureTrackConfig', 'get')
      .mockReturnValue({
        enableRequestsTracking: true,
        appinsightsInstrumentationkey: '',
        trackLocally: true
      });
    const handler = new CallHandlerFake();
    handler.handle = jest.fn().mockReturnThis();
    const context = new Context([]);
    const trackSpy = jest.spyOn(telemetry, 'trackDependency');
    // @ts-ignore
    tap = jest.fn().mockImplementation((callback: (data: unknown) => void) => callback({
      response: 1
    }));

    interceptor.intercept(context, handler);

    expect(trackSpy).toHaveBeenCalled();
  });

  it('When: Logging disabled. Expected: Responses are not logged', () => {
    jest
      .spyOn(appConfigService, 'azureTrackConfig', 'get')
      .mockReturnValue({
        enableRequestsTracking: false,
        appinsightsInstrumentationkey: '',
        trackLocally: true
      });
    const handler = new CallHandlerFake();
    handler.handle = jest.fn().mockReturnThis();
    const context = new Context([]);
    const trackSpy = jest.spyOn(telemetry, 'trackDependency');
    // @ts-ignore
    tap = jest.fn().mockImplementation((callback: (data: unknown) => void) => callback({
      response: 1
    }));

    interceptor.intercept(context, handler);

    expect(trackSpy).not.toHaveBeenCalled();
  });
});
