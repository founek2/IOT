const mongoose = require('mongoose');
const hat = require('hat');
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
      title:  String,
      body:   String,
      created: { type: Date, default: Date.now },
      data: Array,
      apiKey: { type: String, default: hat },
    });
    sensorSchema.methods.findByApiKey = function(apiKey, cb){
      return this.model('Sensors').find({ apiKey: apiKey }, cb);
    }    

  module.exports = sensorSchema;
