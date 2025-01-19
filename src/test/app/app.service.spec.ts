import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../../app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "Eteg API"', () => {
      expect(appService.getHello()).toBe(`${process.env.COMPANY_NAME} API`);
    });
  });
});
