const {Router} = require('express');
const config = require('config');
const Stock = require('../models/Stock')
const auth = require('../middleware/auth.middleware');
const yahooFinance = require('yahoo-finance');
const {check, validationResult} = require('express-validator');
const mongoose = require('mongoose');
const router = Router();



const normalizeDate = (date, fetch=false) => {
  const oldDate = new Date(date);
  let dd = oldDate.getDate();
  let mm = oldDate.getMonth() + 1;
  const yy = oldDate.getFullYear();
  if (dd<10) {dd='0'+dd};
  if (mm<10) {mm='0'+mm};
  if (fetch) {
    return `${yy}-${mm}-${dd}`
  }
  return `${yy}.${mm}.${dd}`;
}

function movingAvg(array, count){
  const avg = function(array){
    let sum = 0;
    for (let i = 0; i < array.length; i++){
        sum += array[i];
    }
    return sum / array.length;
  };
  let result = [];
  for (let i=0; i < count-1; i++)
      result.push(null);
  for (let i=0, len=array.length - count; i <= len; i++){
      const val = avg(array.slice(i, i + count));
      result.push(val.toFixed(2));
  }
  return result;
}

// data = [{date: "2019.12.31", open: 72.482498, high: 73.419998, low: 72.379997, close: 73.412498},
// {date: "2020.01.02", open: 74.059998, high: 75.150002, low: 73.797501, close: 75.087502},
// {date: "2020.01.03", open: 74.287498, high: 75.144997, low: 74.125, close: 74.357498},
// {date: "2020.01.06", open: 73.447502, high: 74.989998, low: 73.1875, close: 74.949997},
// {date: "2020.01.07", open: 74.959999, high: 75.224998, low: 74.370003, close: 74.597504},
// {date: "2020.01.08", open: 74.290001, high: 76.110001, low: 74.290001, close: 75.797501},
// {date: "2020.01.09", open: 76.809998, high: 77.607498, low: 76.550003, close: 77.407501},
// {date: "2020.01.10", open: 77.650002, high: 78.167503, low: 77.0625, close: 77.582497},
// {date: "2020.01.13", open: 77.910004, high: 79.267502, low: 77.787498, close: 79.239998}]

const predictData = (data, period, count) => {
  if (!data) {
    return []
  }
  const curDate = data[data.length - 1].date;
  let oldDate = new Date(curDate);
  const curValue = data[data.length - 1].open;
  const firstValue =  data[0].open;
  let randomData = [];
  for (let i = 0; i < count; i++) {
    randomData.push(curValue);
  }
  for (let i = count; i < period + count; i++) {
    const x = Math.floor(Math.min(curValue, firstValue) + Math.random() * (Math.max(curValue, firstValue) + 1 - Math.min(curValue, firstValue)));
    randomData.push(parseFloat(x.toFixed(2)));
  }
  const avgData = movingAvg(randomData, count);
  const outputData = [];
  for (let i = count; i < avgData.length; i++) {
    do {
      oldDate.setDate(oldDate.getDate() + 1);
    } while (oldDate.getDay() === 0 || oldDate.getDay() === 6);
    outputData.push({date: normalizeDate(oldDate), openPred: avgData[i]});
  }
  return outputData;
}

router.get('/', auth, async (req, res) => {
  try {
    const symbol = req.headers.symbolstock;
    const timePeriod = 24 * 60 * 60 * 1000 * parseInt(req.headers.timeperiod);
    const timePredict = parseInt(req.headers.timepredict);
    const today = new Date();
    const histData = await yahooFinance.historical({
      symbol: symbol,
      from: normalizeDate(today.getTime() - timePeriod, true),
      to: normalizeDate(today, true),
      period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }, function (err, quotes) {
      if (err) {
        res.status(500).json({ message: `Что-то пошло не так. ${err}` })
      } else {
      quotes = quotes.reverse();
      const returnedData = predictData(quotes, timePredict, 10);
      quotes.forEach(elem => {
        elem.date = normalizeDate(elem.date);
      });
      res.json(quotes.concat(returnedData));
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

router.get('/short', auth, async (req, res) => {
  try {
    const symbol = req.headers.symbolstock;
    const timePeriod = 24 * 60 * 60 * 1000 * 22;
    const today = new Date();
    const histData = await yahooFinance.historical({
      symbol: symbol,
      from: normalizeDate(today.getTime() - timePeriod, true),
      to: normalizeDate(today, true),
      period: 'd'
    }, function (err, quotes) {
      if (err) {
        res.status(500).json({ message: `Что-то пошло не так. ${err}` })
      } else {
        const symbol = quotes.symbol;
        const curValue = parseFloat(quotes[0].open.toFixed(2));
        const returnedData = parseFloat(predictData(quotes, 22, 10).pop().openPred);
        let trend = '';
        let procentPrep = '';
        let procent = '';
        if (curValue >= returnedData) {
          trend = 'Понижение';
          procentPrep = 100 - (returnedData * 100 / curValue);
          procent = '-' + procentPrep.toFixed(2) + '%';
        } else {
          trend = 'Повышение';
          procentPrep = (returnedData * 100 / curValue) - 100;
          procent = '+' + procentPrep.toFixed(2) + '%';
        }
        res.json({symbol, trend, curValue, returnedData, procent});
      }
    });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

//api/data/buy
router.post(
  '/buy', auth, 
  [
    check('countStocks', 'Введите колличество').isInt({ min: 1, max: 10000 }),
    check('priceStocks', 'Введите стоимость').exists().isInt({ min: 1, max: 10000 })
  ], async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные для покупки'
        })
      }
      const {symbol, companyName, countStocks, priceStocks, date} = req.body;
      const stock = await Stock.findOne({ owner: req.user.userId, symbol })
      if (stock) {
        stock.priceStocks = priceStocks;
        stock.countStocks = +stock.countStocks + +countStocks;
        await stock.save();
      } else {
        const stock = new Stock({
          symbol, companyName, countStocks, 
          priceStocks, date, owner: req.user.userId
        })
        await stock.save();
      }

      res.status(201).json({ message: 'Данные записаны в портфель' });
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

//api/data/history
router.get(
  '/history', auth, async (req, res) => {
    try {
      const stocks = await Stock.find({ owner: req.user.userId })
      res.json(stocks)
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })

module.exports = router;