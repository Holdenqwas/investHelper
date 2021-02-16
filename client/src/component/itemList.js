import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext';
import {Loader} from '../component/loader';


export const ItemList = ({item, changeStock}) => {
  const [data, setData] = useState([])
  const [color, setColor] = useState('')
  const {loading, request} = useHttp();
  const {token} = useContext(AuthContext)
  // 
  const fetchData = useCallback(async () => {
    try {
      const data = await request('/api/data/short', 'GET', null, {
        symbolStock: item.Symbol,
        Authorization: `Bearer ${token}`
      });
      setData(data);
      if (data.trend === 'Понижение') {
        setColor("red-text");
      } else {
        setColor("green-text");
      }
    } catch (e) {}
  }, [token, request, item.Symbol])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return <Loader/>
  }

  return (
    <a href="#!" className="collection-item black-text" onClick={() => changeStock(item.Name, item.Symbol)}>
      <div className="titleName">{item.Symbol}</div>
      <div className="row1">
        <div>
          <div>Курс</div>
          <div className={color}>{data.trend}</div>
        </div>
        <div>
          <div>Текущая цена</div>
          <div>{`${data.curValue}$`}</div>
        </div>
        <div>
          <div>Прогноз</div>
          <div className="row12">
            <div>{`${data.returnedData}$`}</div>
            <div className={"procent " + color}>{data.procent}</div>
          </div>
        </div>
      </div>
      <div className="row2">Прогноз на 30 дней</div>
    </a>
  )
};