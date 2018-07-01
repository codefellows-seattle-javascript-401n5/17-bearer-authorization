'use strict';

require('dotenv').config();

import {
  Mockgoose,
} from 'mockgoose';
import mongoose from 'mongoose';

import supertest from 'supertest';
import {
  server,
} from '../../../src/app.js';
// import modelsHelper from '../../../scripts/models.helper.js';
// import Coffee from '../../../src/models/coffee';

const mockRequest = supertest(server);

jest.setTimeout(60000);

const mockgoose = new Mockgoose(mongoose);


afterAll((done) => {
  mongoose.disconnect().then(() => {
    console.log('disconnected');
    done();
  }).catch((err) => {
    console.error(err);
    done();
  });
});

beforeAll((done) => {
  console.log('before all console');
  
  mockgoose.prepareStorage().then(() => {
    mongoose.connect('mongodb://localhost/lab_17').then(() => {
      done();
    });
  });
});

afterEach((done) => {
  console.log('after each done');
  mockgoose.helper.reset().then(done);
});


describe('api', () => {

  it('mockRequest should exist', () => {
    expect(mockRequest).toBeDefined();
  });


  it('gets a 401 on a empty login', () => {
    return mockRequest
      .get('/signin')
      .then(response => {
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


describe('authorization on model', () => {
  
  let coffeeUrl = '/api/v1/coffee';
  let coffeeModel = { roast: 'roast', coffee: 'coffee' };
  let token;
  let newUser1 = {
    username: 'newer',
    password: 'word',
  };
  
  it('POST 200 for a request made with a valid id', () => {
    return mockRequest
      .post('/signup')
      .send(newUser1)
      .then(response => {
        token = response.text;
        return mockRequest
          .post(coffeeUrl)
          .set('Authorization', 'Bearer ' + token)
          .send(coffeeModel)
          .then(response => {
            expect(response.body.coffee).toBe('coffee');
            expect(response.statusCode).toBe(200);
          });
      });
  });

  it('POST 401 if no token provided', () => {
    return mockRequest
      .post(coffeeUrl)
      .set('Authorization', 'Bearer ' + token)
      .send(coffeeModel)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });

  it('POST 400 if no body provided', () => {
    return mockRequest
      .post('/signup')
      .send(newUser1)
      .then(response => {
        token = response.text;
        return mockRequest
          .post(coffeeUrl)
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .then(response => {
            expect(response.statusCode).toBe(400);
          });
      });
  });

  it('GET 200 for request made with valid id', () => {
    return mockRequest
      .post('/signup')
      .send(newUser1)
      .then(response => {
        token = response.text;
        return mockRequest
          .post(coffeeUrl)
          .set('Authorization', 'Bearer ' + token)
          .send(coffeeModel)
          .then(() => {
            return mockRequest
              .get(coffeeUrl)
              .set('Authorization', 'Bearer ' + token)
              .then(response => {
                expect(response.body[0].coffee).toBe('coffee');
                expect(response.statusCode).toBe(200);
              });
          });
      });
  });

  it('GET 401 if no token provided', () => {
    return mockRequest
      .get(coffeeUrl)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });

  it('GET 404 for valid request with not found model id',() => {
    return mockRequest
      .post('/signup')
      .send(newUser1)
      .then(response => {
        token = response.text;
        return mockRequest
          .post(coffeeUrl)
          .set('Authorization', 'Bearer ' + token)
          .send(coffeeModel)
          .then(() => {
            return mockRequest
              .get(`${coffeeUrl}/fakeID`)
              .set('Authorization', 'Bearer ' + token)
              .then(response => {
                expect(response.statusCode).toBe(404);
              });
          });
      });
  });


  it('PUT 200 for put request with valid id', () => {
    return mockRequest
      .post('/signup')
      .send(newUser1)
      .then(response => {
        token = response.text;
        return mockRequest
          .post(coffeeUrl)
          .set('Authorization', 'Bearer ' + token)
          .send(coffeeModel)
          .then(response => {
            return mockRequest
              .put(`${coffeeUrl}/${response.body._id}`)
              .set('Authorization', 'Bearer ' + token)
              .send({roast: 'new roast', coffee: 'coffee'})
              .then(res => {
                expect(res.body.roast).toBe('new roast');
                expect(response.statusCode).toBe(200);
              });
          });
      });
  });

  it('PUT 401 if no token provided', () => {
    return mockRequest
      .post('/signup')
      .send(newUser1)
      .then(response => {
        token = response.text;
        return mockRequest
          .post(coffeeUrl)
          .set('Authorization', 'Bearer ' + token)
          .send(coffeeModel)
          .then(response => {
            return mockRequest
              .put(`${coffeeUrl}/${response.body._id}`)
              // .set('Authorization', 'Bearer ' + token)
              .send({roast: 'new roast', coffee: 'coffee'})
              .then(res => {
                expect(res.statusCode).toBe(401);
              });
          });
      });
  });

  it('PUT 400 if the body is invalid', () => {
    return mockRequest
      .post('/signup')
      .send(newUser1)
      .then(response => {
        token = response.text;
        return mockRequest
          .post(coffeeUrl)
          .set('Authorization', 'Bearer ' + token)
          .send(coffeeModel)
          .then(response => {
            return mockRequest
              .put(`${coffeeUrl}/${response.body._id}`)
              .set('Authorization', 'Bearer ' + token)
              .send('')
              .then(res => {
                expect(res.statusCode).toBe(400);
              });
          });
      });
  });

  it('PUT 404 for valid request made with invalid model id', () => {
    return mockRequest
      .post('/signup')
      .send(newUser1)
      .then(response => {
        token = response.text;
        return mockRequest
          .post(coffeeUrl)
          .set('Authorization', 'Bearer ' + token)
          .send(coffeeModel)
          .then(() => {
            return mockRequest
              .put(`${coffeeUrl}/fakeID`)
              .set('Authorization', 'Bearer ' + token)
              .send({roast: 'new roast', coffee: 'coffee'})
              .then(res => {
                expect(res.statusCode).toBe(404);
              });
          });
      });
  });
  
});





