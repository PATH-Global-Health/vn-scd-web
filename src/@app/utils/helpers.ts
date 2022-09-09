/* eslint-disable no-useless-escape */

import moment from 'moment';

/* eslint-disable import/prefer-default-export */
export const deburr = (s: string): string => {
  let result = s ?? '';
  result = result.toLowerCase();
  result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  result = result.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  result = result.replace(/đ/g, 'd');
  result = result.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  result = result.replace(/ + /g, ' ');
  result = result.trim();
  return result;
};

export const filterArray = <T>(arr: T[], searchValue: string): T[] => {
  const result = arr.filter((e) =>
    deburr(JSON.stringify(e))
      .toLowerCase()
      .includes(deburr(searchValue.toLowerCase().trim())),
  );

  return result;
};

export const formatNumber = (amount: number | null): string => {
  if (!amount) {
    return '';
  }
  return `${amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
};

export const toVND = (amount: number | null): string => {
  if (!amount) {
    return '';
  }
  return `${amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} ₫`;
};

interface StatusOptions {
  key: string;
  color: string;
  label: string;
  hex: string;
}

const initialStatus: StatusOptions = {
  key: '',
  color: '',
  label: '',
  hex: '',
};
export const getStatusColor = (label: string): StatusOptions => {
  const options = [
    { key: 'UNFINISHED', color: 'blue', label: 'Chưa khám', hex: '#2185d0' },
    { key: 'FINISHED', color: 'green', label: 'Đã thực hiện', hex: '#21ba45' },
    {
      key: 'CANCELED_BY_CUSTOMER',
      color: 'grey',
      label: 'Bên hẹn huỷ',
      hex: '#767676',
    },
    {
      key: 'NOT_DOING',
      color: 'brown',
      label: 'Không thực hiện',
      hex: '#a5673f',
    },
    { key: 'CANCELED', color: 'red', label: 'Huỷ', hex: '#db2828' },
    {
      key: 'TRANSFERRED',
      color: 'violet',
      label: 'Chuyển tiếp',
      hex: '#6435c9',
    },
    {
      key: 'RESULTED',
      color: 'green',
      label: 'Có kết quả',
      hex: '#21ba45',
    },
  ];
  return options.find((o) => o.key === label) || initialStatus;
};

export const getExaminationStatusColor = (label: string): StatusOptions => {
  const options = [
    { key: 'UNFINISHED', color: 'blue', label: 'Chưa khám', hex: '#2185d0' },
    { key: 'FINISHED', color: 'teal', label: 'Đã thực hiện', hex: '#00b5ad' },
    {
      key: 'CANCELED_BY_CUSTOMER',
      color: 'grey',
      label: 'Bên hẹn huỷ',
      hex: '#767676',
    },
    {
      key: 'NOT_DOING',
      color: 'brown',
      label: 'Không thực hiện',
      hex: '#a5673f',
    },
    { key: 'CANCELED', color: 'red', label: 'Huỷ', hex: '#db2828' },
    {
      key: 'RESULTED',
      color: 'green',
      label: 'Có kết quả',
      hex: '#21ba45',
    },
  ];
  return options.find((o) => o.key === label) || initialStatus;
};

export const ToDate = (date: Date | string): string => {
  return date ? moment(date).format('DD-MM-YYYY') : '';
};

export const isDarkTextInChart = (bgColor: string): boolean => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
};

export const generateColor = (arg: { darkness: boolean }): string => {
  const h = Math.ceil(Math.random() * 360);
  const s = 100;
  const l = arg.darkness ? 0.25 : 0.75;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const formatTime = (arg: { date: string; isTime: boolean }): string => {
  return moment(arg.date).isValid()
    ? moment(arg.date).format(`DD-MM-YYYY ${arg.isTime ? 'HH:mm' : ''}`)
    : '';
};

export const toServerTime = (date: string | Date): string => {
  return moment(date).isValid()
    ? moment(date).add(7, 'hours').format('DD-MM-YYYY HH:mm')
    : '';
};
export const toTime = (date: string | Date): string => {
  return moment(date).isValid() ? moment(date).format('DD-MM-YYYY HH:mm') : '';
};
export const toDay = (date: string | Date): string => {
  return moment(date).isValid() ? moment(date).format('DD') : '';
};
export const toMonth = (date: string | Date): string => {
  return moment(date).isValid() ? moment(date).format('MM') : '';
};
export const toYear = (date: string | Date): string => {
  return moment(date).isValid() ? moment(date).format('YYYY') : '';
};
