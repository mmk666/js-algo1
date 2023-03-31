import mock from './mock8.json';

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
  const countries = getCountries(filterKey ? filterData : data);
  const countrytBy = groupByKey(filterKey ? filterData : data, baseKey);
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
  yoy,
  selectedTab,
  excludeFilter
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

const getConversionVal = (RPTD, TRAFFIC) => {
  if (RPTD === '' || RPTD === null || TRAFFIC === '' || TRAFFIC === null) {
    return null;
  }
  return Math.round((RPTD * 100) / TRAFFIC);
};

const getConversionData = (data) => {
  const ST_RPTD_QTY = data['ST_RPTD_QTY'];
  const TRAFFIC_PDP_SESSIONS_NR = data['TS_ADJD_UNITS_VAL'];
  if (ST_RPTD_QTY && TRAFFIC_PDP_SESSIONS_NR) {
    const obj = Object.keys(ST_RPTD_QTY).reduce((accum, item) => {
      const RPTD = ST_RPTD_QTY[item][0];
      const TRAFFIC = TRAFFIC_PDP_SESSIONS_NR[item][0];
      accum[item] = [
        {
          ...RPTD,
          C_MEASURE_VAL: getConversionVal(
            RPTD['C_MEASURE_VAL'],
            TRAFFIC['C_MEASURE_VAL']
          ),
          PPPY_MEASURE_VAL: getConversionVal(
            RPTD['PPPY_MEASURE_VAL'],
            TRAFFIC['PPPY_MEASURE_VAL']
          ),
          PPY_MEASURE_VAL: getConversionVal(
            RPTD['PPY_MEASURE_VAL'],
            TRAFFIC['PPY_MEASURE_VAL']
          ),
          PY_MEASURE_VAL: getConversionVal(
            RPTD['PY_MEASURE_VAL'],
            TRAFFIC['PY_MEASURE_VAL']
          ),
          P_MEASURE_VAL: getConversionVal(
            RPTD['P_MEASURE_VAL'],
            TRAFFIC['P_MEASURE_VAL']
          ),
        },
      ];
      return accum;
    }, {});
    console.log(obj);
    return { ...data, CONVERSION: obj };
  }
  return data;
};

export const getPerformanceTableData = (data, baseKey, yoy) => {
  if (data) {
    const groupedData = generateData(data, baseKey);
    const finalData = getConversionData(groupedData);
    console.log(finalData);
    for (const item in finalData) {
      for (const subItem in finalData[item]) {
        const obj =
          finalData[item][subItem].length > 0
            ? finalData[item][subItem][0]
            : undefined;

        finalData[item][subItem] = {
          Total: obj ? Math.round(obj?.C_MEASURE_VAL) : '-',
          WOW: obj ? getWOW(obj) : '-',
          YOY: obj ? getYOY(obj, yoy) : '-',
        };
      }
    }
    return finalData;
  } else {
    return {};
  }
};

console.log(getPerformanceTableData(mock, 'MEASURE_NAME', 'YoY'));
