const request = require('supertest')
const express = require('express')
const app = require('../../src/app')

beforeEach(() => {
  // reset controller storage
  const controller = require('../../src/controllers/taskController')
  controller._reset()
})

test('health route responds', async () => {
  const res = await request(app).get('/health')
  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('status', 'ok')
})

test('create and retrieve task', async () => {
  const create = await request(app).post('/tasks').send({ title: 'Test task' })
  expect(create.status).toBe(201)
  const list = await request(app).get('/tasks')
  expect(list.status).toBe(200)
  expect(Array.isArray(list.body)).toBe(true)
  expect(list.body.length).toBe(1)
})
