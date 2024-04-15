import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSeed } from 'src/schema/user.seed';
import { configureApp } from 'src/shared/configure_app';
import { SharedTestModule } from 'src/shared/shared_test.module';
import * as request from 'supertest';

const userData = [
  {
    username: 'test',
    password: 'test',
  },
];

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SharedTestModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);

    await app.init();

    await app.get(UserSeed).seed(userData);
  });

  afterEach(async () => {
    await mongoose.connection.close();
    await app.close();
  });

  describe('/v1/auth/login (POST)', () => {
    const path = '/v1/auth/login';

    it('success', () => {
      return request(app.getHttpServer())
        .post(path)
        .send({
          username: 'test',
          password: 'test',
        })
        .expect(201)
        .expect({
          access_token: '',
        });
    });

    it('wrong password', () => {
      return request(app.getHttpServer())
        .post(path)
        .send({
          username: 'test',
          password: 'wrong',
        })
        .expect(401);
    });

    it('missing fields', async () => {
      const badRequests = [{}, { username: 'test' }, { password: 'test' }];

      for (const body of badRequests) {
        await request(app.getHttpServer()).post(path).send(body).expect(400);
      }
    });
  });
});
