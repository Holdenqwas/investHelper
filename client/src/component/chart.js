import React, { PureComponent } from 'react';
import { ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


export default class Chart extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';
  
  render() {
    const {data} = this.props;
    return (
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="date"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" name="Реальные данные" dataKey="open" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" name="Предсказанные данные"dataKey="openPred" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}