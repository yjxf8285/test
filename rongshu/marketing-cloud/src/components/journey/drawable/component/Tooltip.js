import createjs from 'EaselJS';
import Element from '../Element';
import TextField from './TextField';
import Icon from './Icon';

import BITMAP_ARROW_RIGHT from '../../../../assets/images/journey/arrow-right.png';

import {
  SHADOW,
  TOOLTIP_TEXT_FONT_STYLE,
  TOOLTIP_TITLE_FONT_STYLE,
  TOOLTIP_TEXT_FONT_COLOR,
  TOOLTIP_TITLE_FONT_COLOR,
} from '../../constants/define';

import override from 'core-decorators/lib/override';

const RADIUS = 10;
const LINE_HEIGHT = 12;

const getPosition = (width, height) => (position) => {
  if (position === POSITION.LEFT) 
    return [width + 4, height / 2];
  else if (position === POSITION.RIGHT)
    return [-4, height / 2];
  else if (position === POSITION.TOP)
    return [width / 2, height + 4];
  else if (position === POSITION.BOTTOM)
    return [width / 2, -4];
  else
    return [0, 0];
}

export const POSITION = {
  TOP: 90,
  BOTTOM: -90,
  LEFT: 0,
  RIGHT: 180,
};

export default class Tooltip extends Element {
  type = 'tooltip';

  constructor(x, y, width, height, position = POSITION.RIGHT, hasShadow = true) {
    const container = new createjs.Container();
    const props = {
      x, y,
      width, height,
      position,
      hasShadow,
    };

    super(props, container);
  }

  set title(title) {
    const container = this.context;
    const child = container.getChildByName('title');
    if (child) {
      container.removeChild(child);
    }

    this.origin_title = title;
  }

  set texts(texts) {
    const container = this.context;
    if (this.origin_texts) {
      let child;
      this.origin_texts.forEach((_, index) => {
        child = container.getChildByName(`text_${index}`);
        if (child)
          container.removeChild(child);
      })
    }

    this.origin_texts = texts;
  }

  set color(color) {
    this.origin_color = color;
  }

  set backgroundColor(bgColor) {
    this.origin_backgroundColor = bgColor;
  }

  set alpha(alpha) {
    this.origin_alpha = alpha;
  }

  @override
  render() {
    const container = this.context;
    const { x, y, width, height, position, hasShadow } = this.props;
    const texts = this.origin_texts || [];
    const pos = getPosition(width, height);

    container.x = x;
    container.y = y;

    let bgShape = container.getChildByName('bg');
    if (!bgShape) {
      bgShape = new createjs.Shape();
      bgShape.shadow = hasShadow ? SHADOW : null;
      bgShape.alpha = this.origin_alpha || 1;
      bgShape
        .graphics
        .beginFill(this.origin_backgroundColor || '#FFF')
        .drawRect(0, 0, width, height);

      container.addChild(bgShape);
    }

    let polys = container.getChildByName('polys');
    if (!polys) {
      polys = new createjs.Shape();
      polys.name = 'polys';
      container.addChild(polys);

      const [x, y] = pos(position);

      polys.alpha = this.origin_alpha || 1;
      polys
        .graphics
        .beginFill(this.origin_backgroundColor || '#FFF')
        .drawPolyStar(
          x,         // center x
          y, // center y
          8,          // outer radius of the shape
          3,          // side count
          0,          // pointSize
          position);      // angle
    }

    let title = container.getChildByName('title');
    if (!title) {
      title = new TextField(this.origin_title, 'left', 'middle', TOOLTIP_TITLE_FONT_STYLE, TOOLTIP_TITLE_FONT_COLOR, RADIUS, RADIUS + LINE_HEIGHT / 2);
      title.name = 'title';
      title.color = this.origin_color;
      this.addChild(title);
    }

    let text;
    texts.forEach((t, i) => {
      text = container.getChildByName(`text_${i}`);
      if (!text) {
        text = new TextField(t, 'left', 'middle', TOOLTIP_TEXT_FONT_STYLE, TOOLTIP_TEXT_FONT_COLOR, RADIUS, RADIUS + 4 + (LINE_HEIGHT + 6) * (i + 1) + LINE_HEIGHT / 2);
        text.name = `text_${i}`;
        if (i === 0) {
          text.context.color = '#009688';
        }
        this.addChild(text);
      }
    });

    super.render();
  }
}
