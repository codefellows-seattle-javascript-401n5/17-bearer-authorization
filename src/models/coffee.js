'use strict';

import mongoose, {Schema} from 'mongoose';

const CoffeeSchema = mongoose.Schema({
  roast: {type:String, required:true},
  coffee: {type:String, required:true},
  userID: {type: Schema.Types.ObjectId, ref: 'users'},
});

export default mongoose.model('coffee', CoffeeSchema);

