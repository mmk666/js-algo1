import moment from 'moment';
import data from './mock4.json';
import status from './mock3.json';

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

const covertToPercentage = (item, excludeKey = '') => {
  const rowTotal = Object.keys(item).reduce((accum, keyItem) => {
    if (keyItem !== excludeKey) {
      return accum + item[keyItem];
    }
    return accum;
  }, 0);
  let scaleFactor = rowTotal === 0 ? 0 : 100 / Number(rowTotal);

  Object.keys(item).map((key) => {
    if (key !== excludeKey) {
      item[key] = Number(item[key]) * scaleFactor;
    }
  });
  return item;
};

const generateBarData = (data = [], keys = [], deepDive = false) => {
  const filterKey = deepDive
    ? 'LOB_TO_QUOTES_SUB_STATUS'
    : 'QUOTES_TO_GOAL_SUB_STATUS';
  const dateKey = 'TIME_PERIOD';

  const group = groupByKey(data, dateKey);

  const arr = Object.values(group).map((item) => {
    return item.reduce((accum, item) => {
      const obj = { ...accum };
      if (accum[item[filterKey]]) {
        obj[item[filterKey]] = obj[item[filterKey]] + item.CONTRIBUTION_JST;
      } else {
        obj['date'] = item[dateKey];
        obj[item[filterKey]] = item.CONTRIBUTION_JST;
      }
      return obj;
    }, {});
  });

  return arr.map((item) => {
    return covertToPercentage(item, 'date');
  });
};

const keys1 = ['Goal', '> Goal', 'QNP', 'OOS', 'NL'];
const keys2 = ['<3 Days', '~4w', '~3w', '~2w', '~1w', 'QNP', 'OOS', 'NL'];

const arr = generateBarData(data, keys1);
//const deepDive = generateBarData(data, keys2, true);
console.log(arr);
// console.log(deepDive);

const get_C_P_totals = (data) => {
  return data.reduce((accum, item) => {
    return {
      C_CONTRIBUTION_JST: accum.C_CONTRIBUTION_JST
        ? accum.C_CONTRIBUTION_JST + item.C_CONTRIBUTION_JST
        : item.C_CONTRIBUTION_JST,
      P_CONTRIBUTION_JST: accum.P_CONTRIBUTION_JST
        ? accum.P_CONTRIBUTION_JST + item.P_CONTRIBUTION_JST
        : item.P_CONTRIBUTION_JST,
    };
  }, {});
};

const generateStatusData = (data, deepDive = false) => {
  const mainFilterKey = deepDive
    ? 'LOB_TO_QUOTES_STATUS'
    : 'QUOTES_TO_GOAL_STATUS';
  const filterKey = deepDive
    ? 'LOB_TO_QUOTES_SUB_STATUS'
    : 'QUOTES_TO_GOAL_SUB_STATUS';

  const group = groupByKey(data, mainFilterKey);

  const total = get_C_P_totals(data);

  return Object.keys(group).reduce((accum, arr) => {
    accum[arr] = group[arr].reduce((accum, item) => {
      const obj = { ...accum };
      const scaleFactor = 100 / Number(total.C_CONTRIBUTION_JST);
      if (accum[item[filterKey]]) {
        obj[item[filterKey]] = {
          ...obj[item[filterKey]],
          rowTotal: item.C_CONTRIBUTION_JST + accum[item[filterKey]].rowTotal,
          mix:
            obj[item[filterKey]].mix +
            (item.C_CONTRIBUTION_JST !== ''
              ? Number(item.C_CONTRIBUTION_JST) * scaleFactor
              : 0),
          wow: obj[item[filterKey]].wow + item.P_CONTRIBUTION_JST,
        };
      } else {
        obj[item[filterKey]] = {
          title: item[filterKey],
          rowTotal: item.C_CONTRIBUTION_JST,
          mix:
            item.C_CONTRIBUTION_JST !== ''
              ? Number(item.C_CONTRIBUTION_JST) * scaleFactor
              : 0,
          wow: item.P_CONTRIBUTION_JST,
        };
      }
      return obj;
    }, {});

    return accum;
  }, {});
};

//console.log(generateStatusData(status, true));

/*
Object.keys(group).reduce((accum, arr) => {
    accum[arr] = group[arr].reduce((accum, item) => {
      const obj = { ...accum };
      if (accum[item[filterKey]]) {
        obj[item[filterKey]] = {
          title: item[filterKey],
          mix: obj[item[filterKey]].mix + item.CONTRIBUTION_JST,
          wow: obj[item[filterKey]].wow + item.CONTRIBUTION_JST,
        };
      } else {
        obj[item[filterKey]] = {
          title: item[filterKey],
          mix: item.CONTRIBUTION_JST,
          wow: item.CONTRIBUTION_JST,
        };
      }
      return obj;
    }, {});

    return accum;
  }, {});
*/
