const mongoose = require('mongoose');

const AbandonedSchema = mongoose.Schema(
  {
    user: {
      type: Object, 
      required: true,
    },
    cart: {
      type: Object, 
      required: true, 
    },
    timestamp: {
      type: Date, 
      required: true, 
    },
  },
  { timestamps: true }
);

const AbandonedModel = mongoose.model('Abandoned', AbandonedSchema);

module.exports = AbandonedModel;
