import mock from './mock6.json';

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

export const getCountries = (data) => {
  if (data) {
    const arr = data?.map((item) => item['COUNTRY_NAME']);
    return [...new Set(arr)];
  } else {
    return [];
  }
};

const generateData = (data, baseKey, filterKey, filterkey2) => {
  const filterData = data.filter(
    (item) => item['MEASURE_NAME'] === (filterKey || filterkey2)
  );
  const countries = getCountries(filterData);
  const countrytBy = groupByKey(filterData, baseKey);
  const list = Object.keys(countrytBy).reduce((accum, item) => {
    const group = groupByKey(countrytBy[item], 'COUNTRY_NAME');
    countries.map((item) => {
      if (group[item] === undefined) {
        group[item] = [];
      }
    });
    accum[item] = group;
    return accum;
  }, {});
  return list;
};

const getWOW = (item) => {
  const C_value = Math.round(item?.C_MEASURE_VAL);
  const P_value = Math.round(item?.P_MEASURE_VAL);

  if (C_value == 0) {
    return '100%';
  } else if (P_value == 0) {
    return '-';
  } else {
    return `${Math.round((C_value / P_value - 1) * 100)}%`;
  }
};

const getYOY = (item, type) => {
  const C_value = Math.round(item?.C_MEASURE_VAL);
  const P_value = Math.round(
    type === 'YoY-3'
      ? item?.PPPY_MEASURE_VAL
      : type === 'YoY-2'
      ? item?.PPY_MEASURE_VAL
      : item?.PY_MEASURE_VAL
  );

  if (C_value == 0) {
    return '100%';
  } else if (P_value == 0) {
    return '-';
  } else {
    return `${Math.round((C_value / P_value - 1) * 100)}%`;
  }
};

export const getTableData = (
  data,
  baseKey,
  selectedTab,
  excludeFilter,
  yoy
) => {
  if (data) {
    const groupedData = generateData(data, baseKey, selectedTab, excludeFilter);
    for (const item in groupedData) {
      for (const subItem in groupedData[item]) {
        const QTD = groupedData[item][subItem].find(
          (item) => item['MEASURE_NAME'] === selectedTab
        );
        //console.log(QTD);

        const Q3 = groupedData[item][subItem].find(
          (item) => item['MEASURE_NAME'] === 'ST_SBMTD_STK_FCST_QTY'
        );

        groupedData[item][subItem] = {
          QTD: QTD ? Math.round(QTD?.C_MEASURE_VAL) : '-',
          Q3: Q3 ? Math.round(Q3?.C_MEASURE_VAL) : '-',
          WOW: QTD ? getWOW(QTD) : '-',
          YOY: QTD ? getYOY(QTD, yoy) : '-',
        };
      }
    }
    return groupedData;
  } else {
    return {};
  }
};

console.log(getTableData(mock, 'LOB_VAL', 'ST_RPTD_QTY', 'ST_SBMTD_STK_FCST_QTY'))