import React, {useState, useEffect} from 'react';
import symbols from '../csvjson.json';
import {TextInput} from 'react-materialize';
import {SearchItem} from './searchItem';

export const Search = ({changeStock}) => {
  const [term, setTerm] = useState('');
  const [items, setItems] = useState([]);
  const [showItems, setShowItems] = useState(false);
  let id = 0;

  const onUpdateSearch = (e) => {
    const term = e.target.value;
    setTerm(term);
    
  };

  const searchInBase = (term) => {
    const result = symbols.filter(obj => obj["Name"].toLowerCase().indexOf(term.toLowerCase()) > -1);
    return result;
  };

  useEffect(() => {
    const deleteItem = () => {
      setShowItems(false);
      setItems([]);
      setTerm('');
    }
    
    if (term) {
      const ans = searchInBase(term);
      if (ans.length === 0) {
        setShowItems(false);
      } else {
      const component = ans.map((item) => {
        id++;
        return <SearchItem name={item["Name"]} 
                            symbol={item["Symbol"]}
                            key={id}
                            changeStock={changeStock}
                            deleteItem={deleteItem}/>
      }
      )
      setItems(component);
      setShowItems(true);
      }
    } else {
      setItems([])
      setShowItems(false);
    }
  }, [term, id, changeStock]);

  return (
    <div className="search-field">
      <TextInput
        icon="search"
        id="TextInput-4"
        label="Search"
        onChange={onUpdateSearch}
        autoComplete="off"
      />
      <div className={showItems ? "search-all-items show-search" : "search-all-items hide-search"}>
        {showItems ? items : null}
      </div>
    </div>
  )
};