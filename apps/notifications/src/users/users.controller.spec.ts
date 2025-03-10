import { Test, TestingModule } from '@nestjs/testing';
import { UserNotificationsController } from './users.controller';
import { UserNotificationsService } from './users.service';

describe('UserNotificationsController', () => {
  let notificationsController: UserNotificationsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserNotificationsController],
      providers: [UserNotificationsService],
    }).compile();

    notificationsController = app.get<UserNotificationsController>(UserNotificationsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(notificationsController.getHello()).toBe('Hello World!');
    });
  });
});
