import createjs from 'EaselJS';

const COLORS = [
  '#90CAF9',
  //'#FF5252',
  '#FFB74D',
  '#81C784',
  '#4DB6AC',
  '#9FABDA',
  '#F$8FB1',
  '#CE93D8',
  '#FFCC00',
  '#4DD0E1',
  '#FF5252',
];

export const MODE = {
  NORMAL: 0,
  PRE_COMPARE: 1,
  RESULT: 2,
  SHOW_MENU: 3,
};

export const DEBUG_COLOR = '#D0D0D0';
export const DEBUG = process.env.NODE_ENV === 'development';

export const WIDTH_UNIT_LIMIT = 110;
export const HEIGHT_UNIT_LIMIT = 220;
export const LINE_HEIGHT = 30;
export const PADDING = WIDTH_UNIT_LIMIT + 50;

export const NODE_NAME_FONT_STYLE = 'normal 14px Arial';
export const NODE_NAME_FONT_COLOR = '#333';

export const NODE_FLAG_FONT_STYLE = 'normal 12px Arial';
export const NODE_FLAG_FONT_COLOR = '#666';

export const TOOLTIP_TEXT_FONT_STYLE = 'normal 12px Arial';
export const TOOLTIP_TEXT_FONT_COLOR = '#333';
export const TOOLTIP_TITLE_FONT_STYLE = 'normal 14px Arial';
export const TOOLTIP_TITLE_FONT_COLOR = '#666';

export const X_INDEX_TO_PX = (x) => x * WIDTH_UNIT_LIMIT + PADDING;
export const Y_INDEX_TO_PX = (y) => y * HEIGHT_UNIT_LIMIT + PADDING;

export const RADIUS = 41;

export const MAX_VALUE_LIMIT = 32;

export const NODE_COLORS = (index) => () => COLORS[index];
export const DARK_COLOR = (color) => {
  const colors = color.match(/[\d\w]{2}/ig);
  return colors.reduce((final, item) => {
    final += (parseInt(item, 16) - 0x33).toString(16);
    return final;
  }, '#');
};

export const SHADOW = new createjs.Shadow('#ccc', 5, 5, 30);

export const DROPPED = 'dropped';
export const PRESENT = 'present';
export const FLAG_MAPS = {
  [PRESENT]: '留在当前环节',
  [DROPPED]: '流失',
  'moved': '进入下一环节',
  'converted': '成功转化',
  'injected': '进入旅程',
};

export const TO_NUMBER = (value) => {
  let num = 0;
  if (/(.+)k$/ig.test(value)) {
    num = (+RegExp.$1) * 1000;
  } else {
    num = +value;
  }

  return num;
};

export const NUMBER_FORMAT = (value) => {
  if (isNaN(value))
    return 0;
  if (value < 1000)
    return value;

  return `${( value / 100 >> 0 ) / 10}k`;
};

export const PERSENT_FORMAT = (value) => {
  if (isNaN(value))
    return 0;

  return `${ (value * 1000 >> 0) / 10 }%`;
};
