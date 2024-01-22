import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SaveDataController } from '../controllers/saveData.controller';
import RequestModel from '../assets/utils/models/Request';

describe('SaveDataController', () => {
    let app: INestApplication;
    let saveDataController: SaveDataController;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [SaveDataController],
        })
            // Mock any services or modules if required
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        saveDataController =
            moduleFixture.get<SaveDataController>(SaveDataController);
    });

    it('should be defined', () => {
        expect(saveDataController).toBeDefined();
    });

    it('should save data successfully', async () => {
        // Mock RequestModel.findOne and RequestModel.create behavior here
        jest.spyOn(RequestModel, 'findOne').mockResolvedValue(undefined);
        jest.spyOn(RequestModel, 'create').mockResolvedValue(undefined);

        await request(app.getHttpServer())
            .post('/saveData')
            .send({ data: { request: 'testRequest' } }) // Example request data
            .expect(HttpStatus.OK);
    }, 30000);

    // More tests for error handling, invalid data, etc.
    it('should return 500 if RequestModel.findOne throws an error', async () => {
        jest.spyOn(RequestModel, 'findOne').mockRejectedValue(
            new Error('Test error'),
        );

        await request(app.getHttpServer())
            .post('/saveData')
            .send({ data: { request: 'testRequest' } }) // Example request data
            .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 400 if data is invalid', async () => {
        jest.spyOn(RequestModel, 'findOne').mockResolvedValue(undefined);
        jest.spyOn(RequestModel, 'create').mockResolvedValue(undefined);

        await request(app.getHttpServer())
            .post('/saveData')
            .send({ data: { invalid: 'testRequest' } }) // Invalid request data
            .expect(HttpStatus.BAD_REQUEST);
    });

    afterEach(async () => {
        await app.close();
    });
});
