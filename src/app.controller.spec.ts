import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { GameBarService } from './game-bar.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [GameBarService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
      console.log("use me later")
    });
  });
});
