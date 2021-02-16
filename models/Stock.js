const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  date: {type: Date, required: true, unique: true},
  symbol: {type: String, required: true},
  companyName: {type: String, required: true},
  countStocks: {type: String, required: true},
  priceStocks: {type: String, required: true},
  owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Stock', schema)