const request = require('supertest');
const app = require('../src/index');

describe('POST /DevOps', () => {
  it('should respond with correct message', async () => {
    const response = await request(app)
      .post('/DevOps')
      .set('X-Parse-REST-API-Key', '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c')
      .send({
        message: "This is a test",
        to: "Juan Perez",
        from: "Rita Asturia",
        timeToLifeSec: 45
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("Hello Juan Perez");
  });
});
