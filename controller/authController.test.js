const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('POST /api/users/login', () => {
  it('should return 200 and a token on successful login', async () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(app).post('/api/users/login').send(user);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      email: expect.any(String),
      subscription: expect.any(String),
    });
  });
});
