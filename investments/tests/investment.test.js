const request = require('supertest');
const app = require('../src/index');

describe('GET /investments', () => {
    it('should return a list of investments', async () => {
      const response = await request(app).get('/investments');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('GET /investments/:id', () => {
  it('should return the investment with the specified ID', async () => {
    const validId = '5';
    const expectedInvestment = {
      id: '5',
      userId: '1',
      firstName: 'Billy',
      lastName: 'Bob',
      date: '2020-03-01',
      holdings: [{'id': '2', 'investmentPercentage': 1}],
      investmentTotal: 12000
    };
    const response = await request(app).get(`/investments/${validId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toEqual(expect.objectContaining(expectedInvestment)); // Access first element of the response body array
  });
});
  
describe('POST /investments/export', () => {
    it('should write CSV data to a file and return 204', async () => {
      const csvData = '...';
      const response = await request(app)
      .post('/investments/export')
      .send({ csv: csvData });
      expect(response.statusCode).toBe(204);
    });
});
  