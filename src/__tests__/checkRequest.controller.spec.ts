import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CheckSafetyController } from '../controllers/checkSafety.controller';
import { AppModule } from '../app.module';
import { execSync } from 'child_process';

jest.mock('child_process', () => ({
    execSync: jest.fn(),
}));

describe('CheckRequestController', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CheckSafetyController],
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('should return NOT_FOUND status when request does not exist', async () => {
        (execSync as jest.Mock).mockReturnValueOnce(Buffer.from('0'));
        const response = await request(app.getHttpServer())
            .get('/checkRequest/nonExistingRequest')
            .expect(HttpStatus.NOT_FOUND);

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    afterEach(async () => {
        await app.close();
    });
});
