const express = require('express')
const app = express()
const mainRouter = require('../mainRoutes')
const data = require('../services/testDB')
const request = require('supertest')
jest.useFakeTimers()

app.use('/', mainRouter)

describe('Routes Function', () => {
  test('Responds to /', async () => {
    const res = await request(app).get('/')
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8')
  })

  test('Responds to /settings', async () => {
    const res = await request(app).get('/settings')
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8')
  })
})

describe('Testing dark mode settings change', () => {
  test('Test to see if it responds with a 200 status', async () => {
    const response = await request(app).post('/changeMode').send({
      darkMode: 'true'
    })

    expect(response.statusCode).toBe(200)
  })
})
