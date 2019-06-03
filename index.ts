const jsf = require('json-schema-faker')
const schema = require('./purchase.schema.json')

const getPurchase = () => jsf(schema)
console.log(getPurchase());


import * as c3 from 'c3'
import 'c3/c3.css'

var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ]
    }
});

setInterval(() => {
    chart.load({
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250, 200],
        ['data2', 50, 20, 10, 40, 15, 25, 10]
      ]
    });
}, 2000)



import { interval } from 'rxjs'; 
import { map } from 'rxjs/operators';

const source = interval(1000).pipe(
  map(_ => getPurchase())
);

source.subscribe(x => console.log(x));
