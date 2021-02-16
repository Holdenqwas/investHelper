import React from 'react';
import {CardPanel} from 'react-materialize';

export const SearchItem = ({name, symbol, changeStock, deleteItem}) => { 
  return (
    <CardPanel className="teal search-card" 
    onClick={() => {
      changeStock(name, symbol)
      deleteItem()}}>
      <span className="black-text">
        {name}
      </span>
      <span className="black-text">
        {` (${symbol})`}
      </span>
    </CardPanel>
  )
}
