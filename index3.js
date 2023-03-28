import data from './mock3.json';

const groupByKey = (data, key) => {
  return data.reduce((accum, item) => {
    const obj = { ...accum };
    if (accum[item[key]]) {
      obj[item[key]] = [...accum[item[key]], item];
    } else {
      obj[item[key]] = [item];
    }
    return obj;
  }, {});
};

console.log(groupByKey(data, 'PRODUCT'));

const layout = {
  lg: [
    { i: 'quote-widget', x: 0, y: 0, w: 100, h: 35, static: true },
    { i: 'extended-no-quote-action', x: 0, y: 37, w: 100, h: 35, static: true },
  ],
};
