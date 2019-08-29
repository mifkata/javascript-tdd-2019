const supertest = require('supertest');
const express = require('express');
const { app } = require('./express');
const { fibonacci } = require('../lib/fibonacci');

const request = supertest(app);

describe('app', () => {
  it('should be a valid express app', () => {
    expect(app instanceof express.application.constructor).to.be.true;
  });

  describe('POST /fib', () => {
    [Infinity, NaN, '123asd', -130].forEach(num => {
      it(`should return 400 for fib(${num})`, () => {
        const body = {
          message: 'invalid_position'
        };

        return request.post('/fibonacci')
          .send({ num })
          .expect(400)
          .then(res => {
            expect(res.body).to.deep.equal(body);
          });
      });
    });

    it('should return 200, when num is valid', () => {
      const value = fibonacci(300).toString();

      return request.post('/fibonacci')
        .send({ num: 300 })
        .expect(200)
        .then(res => {
          expect(res.body).to.deep.equal({ value });
        });
    });

    it('should return correct value, when num is too large', () => {
      const value = fibonacci(2000).toString();

      return request.post('/fibonacci')
        .send({ num: 2000 })
        .expect(200)
        .then(res => {
          expect(res.body).to.deep.equal({ value });
        });
    });
  });

  describe('startic content', () => {
    it('should serve test.html correctly', () => {
      return request.get('/test.html')
        .expect('Content-type', /text\/html/)
        .expect(200)
        .then(res => {
          expect(res.text).to.equal('test.html');
        });
    });

    ['/', '/asdfasdfasd'+Date.now()].forEach(url => {
      it(`should serve ${url} correctly`, () => {
        return request.get(url)
          .expect('Content-type', /text\/html/)
          .expect(200)
          .then(res => {
            expect(res.text).to.equal('index.html');
          });
      });
    });

    it('should serve images correctly', () => {
      return request.get('/test.png')
        .expect('Content-type', /image\/png/)
        .expect(200)
    });

    it('should serve CSS correctly', () => {
      return request.get('/test.css')
        .expect('Content-type', /text\/css/)
        .expect(200)
    });
  });
});