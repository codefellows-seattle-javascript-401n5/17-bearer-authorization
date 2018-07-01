'use strict';

import coffee from '../src/models/coffee';

export default (dir) => {

  const fakeMongo = {
    find: () => Promise.resolve([]),
    findById: () => Promise.resolve({}),
    save: data => Promise.resolve(data),
    findByIdAndUpdate: () => Promise.resolve({}),
    findByIdAndDelete: () => Promise.resolve({}),
  };

  if(typeof dir !== 'string') {
    return {};
  }
  return {
    'foo': {default: fakeMongo},
    'coffee': {default: coffee},
  };
};
