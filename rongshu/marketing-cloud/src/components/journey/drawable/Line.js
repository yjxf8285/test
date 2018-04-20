import createjs from 'EaselJS';

import Element from './Element';

import override from 'core-decorators/lib/override';

import {
  RADIUS,
  WIDTH_UNIT_LIMIT,
  HEIGHT_UNIT_LIMIT,
  LINE_HEIGHT,
  MAX_VALUE_LIMIT,
  PADDING,
} from '../constants/define';

const transform = (max) => (current) => MAX_VALUE_LIMIT * current / max;

export default class Line extends Element {
  type = 'line';

  constructor({
    from: { xIndex: sourceXIndex, yIndex: sourceYIndex },
    to: { xIndex: distXIndex, yIndex: distYIndex },
    number,
    color,
    maxValue,
  }, context) {
    const shape = context || new createjs.Shape();
    const props = {
      sourceXIndex,
      sourceYIndex,
      distXIndex,
      distYIndex,
      color,
      number,
      maxValue,
    };

    super(props, shape);
  }

  @override
  render() {
    const { 
      sourceXIndex, 
      sourceYIndex, 
      distXIndex,
      distYIndex, 
      color, 
      number,
      maxValue,
    } = this.props;
    const { rx: rsx, ry: rsy } = getCenterOfCircle(sourceXIndex, sourceYIndex);
    const { rx: rdx, ry: rdy } = getCenterOfCircle(distXIndex, distYIndex);

    const x1 = rsx + (rdx - rsx) / 3;
    const y1 = rsy - 40;

    const x2 = rdx - (rdx - rsx) / 3 ;
    const y2 = rdy + 40;

    const getWidth = transform(maxValue);

    this.context
      .graphics
      .clear()
      .setStrokeStyle(getWidth(number))
      .beginStroke(color)
      .moveTo(rsx, rsy)
      .bezierCurveTo(x1, y1, x2, y2, rdx, rdy);

    super.render();
  }
}

function getCenterOfCircle(x, y) {
  return { rx: x * WIDTH_UNIT_LIMIT + WIDTH_UNIT_LIMIT / 2 + PADDING, ry: y * HEIGHT_UNIT_LIMIT + LINE_HEIGHT + RADIUS + PADDING };
}
