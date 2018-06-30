'use strict';

export default (err, req, res, next) => {
  console.log('jfeijfiejieojfioewjfoiewjf', err);
  if(err === 400) {
    let error = {error: 'No Body'};
    res.statusCode = 400;
    res.statusMessage = 'Bad Request';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(error));
    res.end();
  }
  else { 
    next(err);
  }
};