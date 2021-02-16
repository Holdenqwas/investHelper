import {useState, useCallback} from 'react';

export const useGraph = () => {
  const [nameStock, setNameStock] = useState({companyName: 'Apple Inc.', symbol: 'AAPL'});
  const changeStock = useCallback((companyName, symbol) => {
    console.log(nameStock);
    setNameStock({companyName, symbol})
  }, [nameStock])
  return { nameStock, changeStock };
}