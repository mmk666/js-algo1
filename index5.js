import data from './mock6.json';

const keys = ['ST_RPTD_QTY', 'ST_LOC_AMT'];

const getConuries = (data) => {
  const list = data.map((item) => item.COUNTRY_NAME);
  return [...new Set(list)];
};

const groupByKey = (data, key) => {
  return data.reduce((accum, item) => {
    if (accum[item[key]]) {
      accum[item[key]] = [...accum[item[key]], item];
    } else {
      accum[item[key]] = [item];
    }
    return accum;
  }, {});
};

const getData = (data, key, filterKey, filterVal) => {
  const filterData = data.filter((item) => item[filterKey] === filterVal);
  const group = groupByKey(filterData, key);
  for (const item in group) {
    group[item] = groupByKey(group[item], 'COUNTRY_NAME');
  }
  return group;
};

console.log(getData(data, 'LOB_VAL', 'MEASURE_NAME', 'ST_RPTD_QTY'));
