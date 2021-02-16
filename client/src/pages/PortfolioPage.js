import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useHttp} from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext';
import {useMessage} from '../hooks/message.hook';
import {Table} from '../component/table';
import {Loader} from '../component/loader';


export const Portfolio = () => {
  const message = useMessage();
  const [content, setContent] = useState([]);
  const [total, setTotal] = useState(0);
  const {loading, request, error, clearError} = useHttp();
  const {token} = useContext(AuthContext);

  const fetchData = useCallback(async () => {
    try {
      const fetched = await request('/api/data/history', 'GET', null, {
        Authorization: `Bearer ${token}`
      });
      const fetchedTotal = fetched.reduce((accum, cur) => {
        console.log(+cur.countStocks * +cur.priceStocks);
        return accum + (+cur.countStocks * +cur.priceStocks)
      }, 0)
      setContent(fetched);
      setTotal(fetchedTotal);
    } catch (e) {}
  }, [token, request])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

	return ( 
    <div>
      <div className="row"></div>
      <div className="row head-portfolio">
        <div className="col head-item s3">Купленные акции</div>
        <div className=" col right-head s3 offset-s6">
          <div>Баланс</div>
          <div className="yellow-area">{`${total}$`}</div>
        </div>
      </div>
      <div className="row">
        <div className="col s12 m10 l8 offset-m2 offset-l2">
          <Table content={content}/>
        </div>
      </div>
    </div>
	)
};