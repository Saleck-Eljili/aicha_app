'use strict'
const request = require('supertest')
const express = require('express')

const app = express()

app.get('/hello', (req, res) => {
    res.json('hello')
})

describe('GET /hello', () => {
    it('répond avec json', (done) => {
        request(app)
            .get('/hello')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    })
})
