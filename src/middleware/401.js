'use strict';

export default (err, req, res, next) => {
  if(err === 401) {
    let error = {error: 'Unauthorized'};
    res.statusCode = 401;
    res.statusMessage = 'Unauthorized';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(error));
    res.end();
  }
  else { 
    next(err);
  }
};