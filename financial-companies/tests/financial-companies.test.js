const request = require('supertest');
const app = require('../src/index');
const companies = require('../src/data.json');

describe('Company Services', () => {
  it('GET /companies should return all companies', async () => {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(companies);
  });

  it('GET /companies/:id should return the company with the specified ID', async () => {
    const companyId = '123';
    const response = await request(app).get(`/companies/${companyId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  }); 
});
