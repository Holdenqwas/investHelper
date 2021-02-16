import React from 'react';
import {RowTable} from '../component/rowTable';


export const Table = ({content}) => {
  return (
    <table className="striped responsive-table">
      <thead>
        <tr>
            <th>Название</th>
            <th>Колличество</th>
            <th>Стартовая цена</th>
            <th>Текущая цена</th>
            <th>Цена через месяц</th>
            <th>Действие</th>
        </tr>
      </thead>

      <tbody>
        { content.map((stock) => {
          return (
            <RowTable stock={stock} key={stock._id} />
          )
        }) }
      </tbody>
    </table>
  )
};