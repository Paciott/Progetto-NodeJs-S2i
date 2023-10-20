// Imports
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import express from 'express';
chai.use(sinonChai);

// Express configuration
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// Tests
describe("Testing: SERVER", () => {

  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mock of req, res, and next objects for each test
    req = {
      params: {},
      body: {},
      query: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });

  it('should respond with a welcome message on /', async () => {
    await app.handle(req, res, next);
    chai.expect(res.status.calledWith(200));
    chai.expect(res.send.calledWith("Hello there! App is working correctly!"));
  });

  it('should respond with a 404 for non-existent routes', async () => {
    req.url = '/nonexistentroute';
    await app.handle(req, res, next);
    chai.expect(res.status.calledWith(404));
    chai.expect(res.send.calledWith("Sorry, this page doesn't exist!"));
  });

  // Restore every stub and mock after each test
  afterEach(() => {
    sinon.restore();
  });
});