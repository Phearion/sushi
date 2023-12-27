import { Test, TestingModule } from '@nestjs/testing';
import { CheckSafetyController } from '../controllers/checkSafety.controller';

describe('CheckSafetyController', () => {
    let controller: CheckSafetyController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CheckSafetyController],
        }).compile();

        controller = module.get<CheckSafetyController>(CheckSafetyController);
    });

    it('should log the request', async () => {
        const data = { request: 'existingRequest' };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await controller.checkRequest(data, res);
    });
});
