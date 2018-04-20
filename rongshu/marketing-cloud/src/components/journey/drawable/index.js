import JourneyStage from './JourneyStage';
import LostStage from './LostStage';
import Top4Stage from './Top4Stage';
import Node from './Node';
import CompareNode from './CompareNode';
import LostNode from './LostNode';
import Line from './Line';
import CompareLine from './CompareLine';

import compose from 'ramda/src/compose';
import reduce from 'ramda/src/reduce';
import map from 'ramda/src/map';
import filter from 'ramda/src/filter';
import max from 'ramda/src/max';
import clamp from 'ramda/src/clamp';

import {
  NODE_COLORS,
  MODE,
} from '../constants/define';

const COLUMN_LIMIT = clamp(15, 999);
const ROW_LIMIT = clamp(0, 999);

export const journey = (canvas) => (datasource) => {
  const { 
    stage: { 
      rowNumber: row, 
      columnNumber: column 
    }, 
    mode = MODE.NORMAL,
    nodes = [], 
    lines = [],
    scale = 1,
    currentXIndex = -1,
  } = datasource;

  const findMaxValue = compose(
    reduce(max, 0),
    filter(i => i != 0),
    map(({ props: { number } }) => number),
  );
  const maxValue = findMaxValue(lines);

  const stage = new JourneyStage(canvas, ROW_LIMIT(row), COLUMN_LIMIT(column), scale);

  lines.forEach(n => {
    const props = n.props;
    const newProps = {
      ...props,
      maxValue,
    };

    let line = null;
    if (mode === MODE.PRE_COMPARE) {
      line = new CompareLine(newProps);
    } else {
      line = new Line(newProps);
    }

    stage.addChild(line);
  });

  nodes.forEach((n, index) => {
    let node = null;
    if (mode === MODE.PRE_COMPARE) {
      node = new CompareNode({
        ...n.props,
        canChecked: n.props.xIndex === currentXIndex,
      });
    } else {
      node = new Node({
        ...n.props,
        canClicked: !(mode === MODE.RESULT),
      });
    }

    stage.addChild(node);
  });

  stage.render();

  if (process.env.NODE_ENV === 'development') {
    const moment = require('moment');
    console.info('update', moment().format('YYYY-MM-DD HH:mm:ss a'));
  }

  return () => stage.unMount();
};

export const lost = (canvas) => (datasource) => {
  const stage = new LostStage(canvas);
  const node = new LostNode(datasource.props);

  stage.addChild(node);
  stage.render();
  
  return () => stage.unMount();
};

export const top4 = (canvas) => (datasource, dropped) => {
  const stage = new Top4Stage(canvas);

  stage.datasource = datasource;
  stage.dropped = dropped;
  stage.render();

  return () => stage.unMount();
};
