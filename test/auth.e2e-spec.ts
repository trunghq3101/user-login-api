import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test',
        password: 'test',
      })
      .expect(201)
      .expect({
        access_token: '',
      });
  });

  it('/v1/auth/login (POST) - missing fields', async () => {
    const badRequests = [{}, { username: 'test' }, { password: 'test' }];

    for (const body of badRequests) {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(body)
        .expect(400);
    }
  });
});
