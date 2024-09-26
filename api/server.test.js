const db = require('../data/dbConfig.js')
const request = require('supertest');
const server = require('./server.js');

test("sanity", () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
});

afterAll(async () => {
  await db.destroy();  
})

describe('server.js', () => {
  test('we are testing the env', () => {
    expect(process.env.NODE_ENV).toBe('testing')
  });
})

describe('GET /', () => {
  let res;
  beforeEach(async () => {
    res = await request(server).get('/')
  });

  test('returns 200 OK', () => {
    return request(server)
      .get('/').then(res => {expect(res.status).toBe(200)})
  })

  test('return { api: "Welcome to the WEBPAGE of JOKES!!!!!"}', async () => {
    expect(res.body).toEqual({ api :  "Welcome to the WEBPAGE of JOKES!!!!!"});
  });
})

describe("api/auth/register", () => {
  let res;
  let payload = {
    username: "Captain Marvel",
    password: "foobar"
  }
  
  beforeEach(async () => {
    res = await request(server).post("/api/auth/register").send(payload).set('Accept', 'application/json');
  })
  

  test('register works', async () => {
    expect(res.status).toBe(200);
  })
  
  test('registered user', async () => {
    expect(res.text).not.toBeNull();
  })
});