import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext';


export const RowTable = ({stock}) => {
  const {symbol, countStocks, priceStocks} = stock;
  const [dataPred, setDataPred] = useState([])
  const [color, setColor] = useState('')
  const {loading, request} = useHttp();
  const {token} = useContext(AuthContext)
  const fetchData = useCallback(async () => {
    try {
      const data = await request('/api/data/short', 'GET', null, {
        symbolStock: symbol,
        Authorization: `Bearer ${token}`
      });
      setDataPred(data);
      if (data.trend === 'Понижение') {
        setColor("red-text");
      } else {
        setColor("green-text");
      }
    } catch (e) {}
  }, [token, request, symbol])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return <tr>
            <td colspan="6">
            <div class="progress">
              <div class="indeterminate"></div>
            </div>
            </td>
          </tr>
  }

  return (
    <tr>
      <td>{ symbol}</td>
      <td>{ countStocks }</td>
      <td>{ `$${ priceStocks }`}</td>
      <td>{ dataPred.curValue }</td>
      <td>{ dataPred.returnedData }<span className={"procent " + color}>{ dataPred.procent }</span></td>
      <td>Купить/продать</td>
    </tr>
  )
}