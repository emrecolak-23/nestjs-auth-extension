import { Test, TestingModule } from '@nestjs/testing';
import { AutheticationController } from './authetication.controller';

describe('AutheticationController', () => {
  let controller: AutheticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutheticationController],
    }).compile();

    controller = module.get<AutheticationController>(AutheticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
