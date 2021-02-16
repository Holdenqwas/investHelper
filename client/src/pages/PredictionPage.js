import React, {useState, useCallback, useEffect} from 'react';
import {Search} from '../component/search';
import {ItemList} from '../component/itemList';
import {Graph} from '../component/graph';
import symbols from '../csvjson.json';

export const Prediction = () => {
	const [nameStock, setNameStock] = useState({companyName: 'Apple Inc.', symbol: 'AAPL'});
	const [randomStocks, setRandomStoks] = useState([]);
	const changeStock = useCallback((companyName, symbol) => {
    setNameStock({companyName, symbol})
  }, [])

	const fetchRandomData = useCallback(() => {
		const arr = []
		for (let i = 0; i < 6; i++) {
			arr.push(symbols[Math.floor(Math.random() * 2900)]);
			setRandomStoks(arr)
		}
	}, [])

	useEffect(() => {
		fetchRandomData();
	}, [fetchRandomData])

	return ( 
		<div className="row">
			<div className="col s12 m6 l3">
				<Search changeStock={changeStock}/>
				<div className="collection">
					{randomStocks.map((item, id) => <ItemList item={item} key={id} changeStock={changeStock}/>)}
				</div>
			</div>
			<div className="col s12 m6 l9">
				<Graph nameStock={nameStock}/>
			</div>
		</div>
	)
};