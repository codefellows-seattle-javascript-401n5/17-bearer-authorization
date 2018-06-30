'use strict';


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

  // it('mockRequest should exist', () => {
  //   expect(mockRequest).toBeDefined();
  // });


  // it('gets a 401 on a empty login', () => {
  //   return mockRequest
  //     .get('/signin')
  //     .then(response => {
  //       expect(response.status).toEqual(401);
  //     });
  // });

  // it('gets a 401 on a bad login', () => {
  //   return mockRequest
  //     .get('/signin')
  //     .auth('one', 'two')
  //     .then(response => {
  //       expect(response.status).toEqual(401);
  //     });
  // });

  // it('gets a 200 on a good login', () => {
  //   return mockRequest
  //     .post('/signup')
  //     .send({username: 'username', password: 'password'})
  //     .then(() => {
  //       return mockRequest
  //         .get('/signin')
  //         .auth('username', 'password')
  //         .then(response => {
  //           expect(response.statusCode).toEqual(200);
  //         })
  //         .catch(console.err);
  //     });
  // });

  // it('post sends 400 if no request body or invalid body', () => {
  //   return mockRequest
  //     .post('/signup')
  //     .then(response => 
  //       expect(response.status).toEqual(400)
  //     );
  // });

  // it('should get 200 if the sign up request is valid', () => {
  //   return mockRequest
  //     .post('/signup')
  //     .send({username: 'use', password: 'pass'})
  //     .then(response => {
  //       expect(response.statusCode).toEqual(200);
  //     });
  // });

  it('gets 200 for a request made with a valid id', () => {

    let coffeeUrl = '/api/v1/coffee';
    let coffeeModel = { roast: 'roast', coffee: 'coffee' };
    let token;
    let newUser1 = {
      username: 'newer',
      password: 'word',
    };
    console.log('OOOOOOOOO', newUser1);
        
    
    return mockRequest
      .post('/signup')
      // .send({username: 'username', password: 'password'})
      .send(newUser1)
      .then(response => {
        console.log(response.text);
        token = response.text;
    
        return mockRequest
          .post(coffeeUrl)
          .set('Authorization', 'Bearer ' + token)
          .send(coffeeModel)
          .then(response => {
            console.log('string', response.text);
    
            expect(response.coffee).toBe('coffee');
          });
      });
    
  });

});





