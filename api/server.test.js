const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

beforeAll(async() => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

describe ('[POST] /auth/register', () => {
  it('[1] adds a user to database', async() => {
    let testUser = {username: 'test', password: 'testword'}
    await request(server).post('/api/auth/register').send(testUser)
    expect(await db('users')).toHaveLength(1)  
  })
  it('[2] returns 400 username is taken', async() => {
    let testUser = {username: 'test', password: 'testword'}
    const res = await request(server).post('/api/auth/register').send(testUser)
    expect(res.status).toBe(400)
  })
  it('[3] returns 400 username and password required', async() => {
    let badTest = {username: '', password: 'testword'}
    const res = await request(server).post('/api/auth/register').send(badTest)
    expect(res.status).toBe(400)
  })
})

describe('[POST] /auth/login', () => {
  it('[4] successfully login with username and password', async() => {
    let loginUser = {username: 'test', password: 'testword'}
    await request(server).post('/api/auth/register').send(loginUser)
    const res = await request(server).post('/api/auth/login').send(loginUser)
    expect(res.status).toBe(200)
  })
  it('[5] returns invalid credentials no matching username', async() => {
    let unmatchedTestName = {username: 'bob', password: 'bobby'}
    const res = await request(server).post('/api/auth/login').send(unmatchedTestName)
   expect(res.text).toBe("{\"message\":\"Invalid credentials\"}")
  })
  it('[6] return invalid credentials no matching password', async() => {
    let unmatchedTestPassword = {username: 'bob', password: 'bobby'}
    await request(server).post('/api/auth/register').send(unmatchedTestPassword)
    const res = await request(server).post('/api/auth/login').send({...unmatchedTestPassword, password: 'boby'})
    expect(res.text).toBe("{\"message\":\"Invalid credentials\"}")


  })
})