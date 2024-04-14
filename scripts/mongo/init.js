/* eslint-disable prettier/prettier */
const db = db.getSiblingDB('auth');

db.createUser({
  user: process.env.MONGO_AUTH_DB_USERNAME,
  pwd: process.env.MONGO_AUTH_DB_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'auth',
    },
  ],
});

print('Database initialized!');
