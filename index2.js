const data = {
  'Extended Quotes': {
    '~2w': {
      title: '~2w',
      rowTotal: {
        C_CONTRIBUTION_JST: 10118647.200000001,
        P_CONTRIBUTION_JST: '',
      },
      mix: 2.012944971537302,
      wow: '',
    },
    '~1w': {
      title: '~1w',
      rowTotal: {
        C_CONTRIBUTION_JST: 10118647.200000001,
        P_CONTRIBUTION_JST: '',
      },
      mix: 4.57327536827255,
      wow: '',
    },
    '~4w': {
      title: '~4w',
      rowTotal: {
        C_CONTRIBUTION_JST: 10118647.200000001,
        P_CONTRIBUTION_JST: '',
      },
      mix: 0.9331365955717874,
      wow: '',
    },
    '~3w': {
      title: '~3w',
      rowTotal: {
        C_CONTRIBUTION_JST: 10118647.200000001,
        P_CONTRIBUTION_JST: '',
      },
      mix: 1.102661233213072,
      wow: '',
    },
  },
  'No Quotes': {
    NL: {
      title: 'NL',
      rowTotal: {
        C_CONTRIBUTION_JST: 10118647.200000001,
        P_CONTRIBUTION_JST: '',
      },
      mix: 5.534759626761173,
      wow: '',
    },
    QNP: {
      title: 'QNP',
      rowTotal: {
        C_CONTRIBUTION_JST: 10118647.200000001,
        P_CONTRIBUTION_JST: '',
      },
      mix: 0.24877238530462845,
      wow: '',
    },
    OOS: {
      title: 'OOS',
      rowTotal: {
        C_CONTRIBUTION_JST: 10118647.200000001,
        P_CONTRIBUTION_JST: '',
      },
      mix: 29.320563721205733,
      wow: '',
    },
    DNA: {
      title: 'DNA',
      rowTotal: {
        C_CONTRIBUTION_JST: 10118647.200000001,
        P_CONTRIBUTION_JST: '',
      },
      mix: 0.7493254631903759,
      wow: '',
    },
  },
  'Acceptable Quotes': {
    '<3 Days': {
      title: '<3 Days',
      rowTotal: {
        C_CONTRIBUTION_JST: 10118647.200000001,
        P_CONTRIBUTION_JST: '',
      },
      mix: 55.52456063494337,
      wow: '',
    },
  },
};

const getPrimarydata = (data, deepDive) =>
  Object.keys(data).reduce((accum, item) => {
    const usage = Object.values(data[item]).reduce((acc, sub) => {
      return Math.ceil(acc + sub['mix']);
    }, 0);

    if (
      (deepDive && item === 'Acceptable Quotes') ||
      (!deepDive && item === 'Extended Quotes')
    ) {
      return accum;
    }

    return [
      ...accum,
      {
        label: item,
        usage,
      },
    ];
  }, []);

const getSecondaryData = (data, deepDive) => {
  const obj = deepDive ? data['Acceptable Quotes'] : data['Extended Quotes'];
  return Object.keys(obj).reduce(
    (accum, item) => [
      ...accum,
      {
        label: item,
        usage: obj[item].mix,
      },
    ],
    []
  );
};

const donuChartData = (data, deepDive) => {
  const arr1 = getPrimarydata(data, deepDive);
  const arr2 = getSecondaryData(data, deepDive);
  return [...arr1, ...arr2];
};

console.log(donuChartData(data, true));
