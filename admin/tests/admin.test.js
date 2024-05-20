const request = require('supertest');
const app = require('../src/index');

describe('Admin Services', () => {
  it('GET /investments/:id should return investment details', async () => {
    const response = await request(app).get('/investments/123'); // Replace with valid ID
    expect(response.statusCode).toBe(200);
  });

  it('GET /generate-csv-report should generate and send CSV report', async () => {
    const response = await request(app).get('/generate-csv-report');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('CSV report generated and sent successfully');
  });
});