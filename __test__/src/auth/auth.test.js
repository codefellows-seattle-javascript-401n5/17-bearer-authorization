'use strict';


import supertest from 'supertest';
import {
  server,
} from '../../../src/app.js';
import modelsHelper from '../../../scripts/models.helper.js';

const mockRequest = supertest(server);


afterAll(modelsHelper.afterAll);
beforeAll(modelsHelper.beforeAll);
afterEach(modelsHelper.afterEach);


describe('api', () => {

  it('mockRequest should exist', () => {
    expect(mockRequest).toBeDefined();
  });


  it('gets a 401 on a empty login', () => {
    return mockRequest
      .get('/signin')
      .then(response => {
        console.log('fjdioefe', response.text);
        
        expect(response.status).toEqual(401);
      });
  });

  it('gets a 401 on a bad login', () => {
    return mockRequest
      .get('/signin')
      .auth('one', 'two')
      .then(response => {
        expect(response.status).toEqual(401);
      });
  });

  it('gets a 200 on a good login', () => {
    return mockRequest
      .post('/signup')
      .send({username: 'username', password: 'password'})
      .then(() => {
        return mockRequest
          .get('/signin')
          .auth('username', 'password')
          .then(response => {
            expect(response.statusCode).toEqual(200);
          })
          .catch(console.err);
      });
  });

  it('post sends 400 if no request body or invalid body', () => {
    return mockRequest
      .post('/signup')
      .then(response => 
        expect(response.status).toEqual(400)
      );
  });

  it('should get 200 if the sign up request is valid', () => {
    return mockRequest
      .post('/signup')
      .send({username: 'use', password: 'pass'})
      .then(response => {
        expect(response.statusCode).toEqual(200);
      });
  });


});






