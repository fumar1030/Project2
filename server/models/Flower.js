const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const FlowerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    progress: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
        default: 0,
    },
    isBloomed: {
        type: Boolean,
        default: false,
      },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        defautl: Date.now,
    },
});

FlowerSchema.methods.water = function () {
    if (this.progress < 5) {
      this.progress += 1;
      if (this.progress === 5) {
        this.isBloomed = true;
      }
    }
    return this.save();
  };

FlowerSchema.statics.toAPI = function (doc) {
  return {
    name: doc.name,
    progress: doc.progress,
    isBloomed: doc.isBloomed,
    id: doc._id,
  };
};

const FlowerModel = mongoose.model('Flower', FlowerSchema);
module.exports = FlowerModel;