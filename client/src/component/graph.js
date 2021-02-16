import React, {useCallback, useContext, useEffect, useState} from 'react';
import Chart from './chart';
import {useHttp} from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext';
import {useMessage} from '../hooks/message.hook';
import {Loader} from '../component/loader';
import {Select, Modal, Button, TextInput} from 'react-materialize';


export const Graph = ({nameStock}) => {
  const message = useMessage()
  const [active, setActive] = useState(22)
  const [form, setForm] = useState({
    symbol: null, companyName: null, countStocks: null, priceStocks: null, date: null
  })
  const [timePredict, setTimePredict] = useState(5);
  const [data, setData] = useState([])
  const {loading, request, error, clearError} = useHttp()
  const {token} = useContext(AuthContext);
  const fetchData = useCallback(async (time, timePredict, symbol) => {
    try {
      const data = await request('/api/data', 'GET', null, {
        symbolStock: symbol,
        timepredict: timePredict,
        timeperiod: time,
        Authorization: `Bearer ${token}`
      });
      setData(data);
    } catch (e) {}
  }, [token, request])

  useEffect(() => {
    fetchData(active, timePredict, nameStock.symbol)
  }, [fetchData, active, timePredict, nameStock])

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  if (loading) {
    return <Loader/>
  }

  const modificator = (value) => {
    if (value === active) {
      return " active-time";
    }
    return "";
  }

  const changeValue = (e) => {
    setTimePredict(parseInt(e.target.value))
  }

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const buyStocks = async (e) => {
    e.preventDefault();
    try {
      const sendData = { ...form, symbol: nameStock.symbol,
        companyName: nameStock.companyName, date: new Date() }
      const data = await request('/api/data/buy', 'POST', {...sendData}, {Authorization: `Bearer ${token}`})
      message(data.message)
    } catch (e) {}
  }

  return (
    <>
    <div className="graph">
				<div className="row title-graph">
					{nameStock.companyName}
				</div>
				<div className="row top-graph">
          <div className="select">
            <div className={"time-select" + modificator(5)} id='w' onClick={() => setActive(5)}>1W</div>
            <div className={"time-select" + modificator(22)} id='m' onClick={() => setActive(22)}>1M</div>
            <div className={"time-select" + modificator(134)} id='m6' onClick={() => setActive(134)}>6M</div>
            <div className={"time-select" + modificator(269)} id='y' onClick={() => setActive(269)}>1Y</div>
          </div>
          <div className="time-progn">
            <Select
              className="select-field"
              id="Select-9"
              label="Время прогноза"
              multiple={false}
              onChange={changeValue}
              options={{
                classes: '',
                dropdownOptions: {
                  alignment: 'left',
                  autoTrigger: true,
                  closeOnClick: true,
                  constrainWidth: true,
                  coverTrigger: true,
                  hover: false,
                  inDuration: 150,
                  onCloseEnd: null,
                  onCloseStart: null,
                  onOpenEnd: null,
                  onOpenStart: null,
                  outDuration: 250
                }
              }}
              value={`${timePredict}`}
            >
              <option value="5">
                1 week
              </option>
              <option value="22">
                1 month
              </option>
              <option value="66">
                3 months
              </option>
              <option value="134">
                6 months
              </option>
              <option value="269">
                1 year
              </option>
            </Select>
            
          </div>
          <Modal
            actions={[
              <Button flat modal="close" node="button" waves="yellow">Закрыть</Button>
            ]}
            bottomSheet={false}
            fixedFooter={false}
            header="Купить акции"
            id="Modal-0"
            open={false}
            options={{
              dismissible: true,
              endingTop: '10%',
              inDuration: 250,
              onCloseEnd: null,
              onCloseStart: null,
              onOpenEnd: null,
              onOpenStart: null,
              opacity: 0.5,
              outDuration: 250,
              preventScrolling: true,
              startingTop: '4%'
            }}
            trigger={<Button className="btn" node="button">Купить</Button>}
          >
            <div>
              <TextInput
                name="priceStocks"
                id="priceStocks"
                placeholder="Цена акций"
                onChange={changeHandler}
                autoComplete="off"
              />
              <TextInput
                name="countStocks"
                id="countStocks"
                placeholder="Колличество акций"
                onChange={changeHandler}
                autoComplete="off"
              />
              <Button
                onClick={buyStocks}
              >
                Купить
              </Button>
            </div>
          </Modal>
				</div>
        <div className="chart">
          <Chart data={data}/>
        </div>
			</div>
  </>
  )
};