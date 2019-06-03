const jsf = require('json-schema-faker')
const schema = require('./purchase.schema.json')
import { Purchase } from './types'

const getPurchase = (): Purchase => jsf(schema)
const purchaseTotalPrice = ({amount, unitPrice}: Purchase) => amount * unitPrice
const purchaseNetPrice = (p: Purchase) => purchaseTotalPrice(p) * (1 - p.vatTax)
const purchaseVatPrice = (p: Purchase) => purchaseTotalPrice(p) * p.vatTax


const to2 = (n: number) => Math.round(n * 100) / 100

import * as c3 from 'c3'
import 'c3/c3.css'

var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
      ]
    }
});

const chartRefresh = (data: any[]) => {
   chart.load({
      columns: [
        data,
      ]
    });
}


import { interval, of, pipe, merge } from 'rxjs'; 
import { map, scan,take, repeat, tap, share } from 'rxjs/operators';

const purchases$ = interval(1000).pipe(
  map(_ => getPurchase()),
  share(),
  take(50)
)

const sumAndRound = () => pipe(
  scan((sum: number, price: number) => sum + price ,0),
  map(to2),
)

const getHistroyWithName = (chartName) => pipe(
  scan((acc, item)=> [...acc, item], [] as number[]),
  map((list: number[]) => [chartName, ...list], [] as number[])
)
const purchasesTotalPrice$ = purchases$.pipe(
  map(purchaseTotalPrice),
  sumAndRound(),
  getHistroyWithName('total')
)

const purchasesNetPrice$ = purchases$.pipe(
  map(purchaseNetPrice),
  sumAndRound(),
  getHistroyWithName('netto')
)
const purchasesVatPrice$ = purchases$.pipe(
  map(purchaseVatPrice),
  sumAndRound(),
  getHistroyWithName('vat')
)

const chartData$ = merge(purchasesTotalPrice$, purchasesNetPrice$, purchasesVatPrice$)

chartData$.subscribe(data => { 
  console.log(data)
    chartRefresh(data)
  });
