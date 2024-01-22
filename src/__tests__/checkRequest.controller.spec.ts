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

    it('should return OK status when request exists', async () => {
        (execSync as jest.Mock).mockReturnValueOnce(Buffer.from('0'));
        const response = await request(app.getHttpServer())
            .get('/checkRequest/existingRequest')
            .expect(HttpStatus.OK);

        expect(response.body.message).toEqual('Request exists');
    });

    it('should return NOT_FOUND status when request does not exist', async () => {
        (execSync as jest.Mock).mockReturnValueOnce(Buffer.from('0'));
        const response = await request(app.getHttpServer())
            .get('/checkRequest/nonExistingRequest')
            .expect(HttpStatus.NOT_FOUND);

        expect(response.body.message).toEqual("Request doesn't exist");
    });

    it('should return BAD_REQUEST status when SQL Injection is detected', async () => {
        (execSync as jest.Mock).mockReturnValueOnce(Buffer.from('1'));
        const response = await request(app.getHttpServer())
            .get('/checkRequest/sqlInjectionAttempt')
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toEqual('SQL Injection detected');
    });

    afterEach(async () => {
        await app.close();
    });
});
