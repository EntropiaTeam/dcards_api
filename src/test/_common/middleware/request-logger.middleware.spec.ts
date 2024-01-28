import { Test, TestingModule } from '@nestjs/testing';
import { Response, Request } from 'express-serve-static-core';
import { RequestLoggerMiddleware } from '../../../_common/middleware/request-logger.middleware';
import { AppConfigService } from '../../../_common/services/app-config.service';
import { AzureService } from '../../../_common/services/azure.service';
import { CallHandlerFake } from '../fake/call-handler.fake';

const mockAppConfig = {
  get azureTrackConfig() { return {}; }
};

describe('RequestLoggerMiddleware', () => {
  let requestLoggerMiddleware: RequestLoggerMiddleware;
  let azureService: AzureService;
  let appConfigService: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestLoggerMiddleware,
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

    requestLoggerMiddleware = module.get(RequestLoggerMiddleware);
    azureService = module.get(AzureService);
    appConfigService = module.get(AppConfigService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Expected: Defined', () => {
    expect(requestLoggerMiddleware)
      .toBeDefined();
  });

  it('Expected: Correct instance', () => {
    expect(requestLoggerMiddleware)
      .toBeInstanceOf(RequestLoggerMiddleware);
  });

  it('When: Logging enabled. Expected: Requests are logged', () => {
    jest
      .spyOn(appConfigService, 'azureTrackConfig', 'get')
      .mockReturnValue({
        enableRequestsTracking: true,
        appinsightsInstrumentationkey: '',
        trackLocally: true
      });
    const handler = new CallHandlerFake();
    handler.handle = jest.fn().mockReturnThis();
    const trackSpy = jest.spyOn(azureService, 'trackDependency');

    requestLoggerMiddleware.use({} as Request, {} as Response, jest.fn());

    expect(trackSpy).toHaveBeenCalled();
  });

  it('When: Logging disabled. Expected: Requests are not logged', () => {
    jest
      .spyOn(appConfigService, 'azureTrackConfig', 'get')
      .mockReturnValue({
        enableRequestsTracking: false,
        appinsightsInstrumentationkey: '',
        trackLocally: true
      });
    const handler = new CallHandlerFake();
    handler.handle = jest.fn().mockReturnThis();
    const trackSpy = jest.spyOn(azureService, 'trackDependency');

    requestLoggerMiddleware.use({} as Request, {} as Response, jest.fn());

    expect(trackSpy).not.toHaveBeenCalled();
  });
});
