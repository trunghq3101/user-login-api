import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { AuthModule } from 'src/auth/auth.module';
import {
  IndefiniteLockError,
  InvalidCredentialsError,
  TimedLockError,
} from 'src/errors';
import { LoginAttemptsSeed } from 'src/login-attempt/login-attempt.seed';
import { configureApp } from 'src/shared/configure_app';
import { SharedTestModule } from 'src/shared/shared_test.module';
import {
  minutesAgoFromNow,
  minutesLater,
  mockDateOrigin,
} from 'src/shared/utils';
import { LockDuration, User, UserDocument } from 'src/user/user.schema';
import { UserSeed } from 'src/user/user.seed';
import * as request from 'supertest';

const userData = [
  {
    username: 'test',
    password: 'test',
  },
  {
    username: 'IndefinitelyLock',
    password: 'IndefinitelyLock',
    lockDuration: LockDuration.Indefinitely,
  },
  {
    username: 'FiveMinutesLock',
    password: 'FiveMinutesLock',
    lockDuration: LockDuration.FiveMin,
    lockedUntil: minutesLater(mockDateOrigin, 5),
  },
] as User[];

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let users: UserDocument[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SharedTestModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);

    await app.init();

    users = await app.get(UserSeed).seed(userData);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await mongoose.connection.close();
    await app.close();
  });

  describe('/v1/auth/login (POST)', () => {
    const path = '/v1/auth/login';

    it('missing fields', async () => {
      const badRequests = [{}, { username: 'test' }, { password: 'test' }];

      for (const body of badRequests) {
        await request(app.getHttpServer()).post(path).send(body).expect(400);
      }
    });

    it('success', () => {
      return request(app.getHttpServer())
        .post(path)
        .send({
          username: 'test',
          password: 'test',
        })
        .expect(201)
        .expect((res) => {
          const { access_token } = res.body;
          expect(access_token).toBeDefined();
          const verified = app.get(JwtService).verify(access_token);
          expect(verified.username).toBe('test');
        });
    });

    it('wrong password', () => {
      return request(app.getHttpServer())
        .post(path)
        .send({
          username: 'test',
          password: 'wrong',
        })
        .expect(400);
    });

    it('indefinitely locked account', () => {
      return request(app.getHttpServer())
        .post(path)
        .send({
          username: 'IndefinitelyLock',
          password: 'IndefinitelyLock',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe(IndefiniteLockError.name);
        });
    });

    it('got FiveMinutes lock', async () => {
      const loginAttemptData = [
        {
          userId: users[0].id,
          createdAt: minutesAgoFromNow(1),
        },
        {
          userId: users[0].id,
          createdAt: minutesAgoFromNow(4),
        },
      ];
      await app.get(LoginAttemptsSeed).seed(loginAttemptData);

      return request(app.getHttpServer())
        .post(path)
        .send({
          username: 'test',
          password: 'wrong',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe(TimedLockError.name);
        });
    });

    it('got FiveMinutes lock then succeeded', async () => {
      const attemptWhileLocked = minutesLater(mockDateOrigin, 4);
      const attemptAfterUnlocked = minutesLater(mockDateOrigin, 5);

      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => attemptWhileLocked.getTime());

      await request(app.getHttpServer())
        .post(path)
        .send({
          username: 'FiveMinutesLock',
          password: 'FiveMinutesLock',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe(TimedLockError.name);
        });

      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => attemptAfterUnlocked.getTime());

      await request(app.getHttpServer())
        .post(path)
        .send({
          username: 'FiveMinutesLock',
          password: 'FiveMinutesLock',
        })
        .expect(201);
    });

    it('got FiveMinutes lock then got Indefinitely lock', async () => {
      const firstAttemptAfterUnlocked = minutesLater(mockDateOrigin, 5);
      const secondAttemptAfterUnlocked = minutesLater(mockDateOrigin, 6);
      const thirdAttemptAfterUnlocked = minutesLater(mockDateOrigin, 7);
      const firstAttemptAfterLocked = minutesLater(mockDateOrigin, 8);

      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => firstAttemptAfterUnlocked.getTime());

      await request(app.getHttpServer())
        .post(path)
        .send({
          username: 'FiveMinutesLock',
          password: 'wrong',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe(InvalidCredentialsError.name);
        });

      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => secondAttemptAfterUnlocked.getTime());

      await request(app.getHttpServer())
        .post(path)
        .send({
          username: 'FiveMinutesLock',
          password: 'wrong',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe(InvalidCredentialsError.name);
        });

      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => thirdAttemptAfterUnlocked.getTime());

      await request(app.getHttpServer())
        .post(path)
        .send({
          username: 'FiveMinutesLock',
          password: 'wrong',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe(IndefiniteLockError.name);
        });

      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => firstAttemptAfterLocked.getTime());

      await request(app.getHttpServer())
        .post(path)
        .send({
          username: 'FiveMinutesLock',
          password: 'FiveMinutesLock',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe(IndefiniteLockError.name);
        });
    });

    describe('got some failed attempts but should not be locked', () => {
      it('failed 3 times consecutively but not within 5 minutes', async () => {
        const loginAttemptData = [
          {
            userId: users[0].id,
            createdAt: minutesAgoFromNow(1),
          },
          {
            userId: users[0].id,
            createdAt: minutesAgoFromNow(6),
          },
        ];
        await app.get(LoginAttemptsSeed).seed(loginAttemptData);

        return request(app.getHttpServer())
          .post(path)
          .send({
            username: 'test',
            password: 'wrong',
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.error).toBe(InvalidCredentialsError.name);
          });
      });

      it('failed 2 in a row, then succeeded, then failed 1 more time', async () => {
        const loginAttemptData = [
          {
            userId: users[0].id,
            createdAt: minutesLater(mockDateOrigin, 0),
          },
          {
            userId: users[0].id,
            createdAt: minutesLater(mockDateOrigin, 1),
          },
        ];
        await app.get(LoginAttemptsSeed).seed(loginAttemptData);

        jest
          .spyOn(global.Date, 'now')
          .mockImplementation(() => minutesLater(mockDateOrigin, 2).getTime());

        await request(app.getHttpServer())
          .post(path)
          .send({
            username: 'test',
            password: 'test',
          })
          .expect(201);

        jest
          .spyOn(global.Date, 'now')
          .mockImplementation(() => minutesLater(mockDateOrigin, 3).getTime());

        return request(app.getHttpServer())
          .post(path)
          .send({
            username: 'test',
            password: 'wrong',
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.error).toBe(InvalidCredentialsError.name);
          });
      });
    });
  });
});
