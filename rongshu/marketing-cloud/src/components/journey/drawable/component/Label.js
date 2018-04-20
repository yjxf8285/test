import createjs from 'EaselJS';
import override from 'core-decorators/lib/override';

import Element from '../Element';
import TextField from './TextField';
import Icon from './Icon';

import {
  NODE_FLAG_FONT_STYLE,
  NODE_FLAG_FONT_COLOR,
} from '../../constants/define';

export default class Label extends Element {
  type = 'label';

  constructor(text, color = '#000', x, y) {
    const container = new createjs.Container();
    const props = {
      text,
      color,
      x,
      y
    };

    super(props, container);
  }

  @override
  render() {
    const { text, color, x, y } = this.props;
    const container = this.context;
    const LINE_HEIGHT = 30;

    container.x = x;
    container.y = y;

    let flag = container.getChildByName('flag');
    if (!flag) {
      if (/^#/ig.test(color)) {
        flag = new createjs.Shape();
        flag.name = 'flag';
        flag
          .graphics
          .beginFill(color)
          .drawRect(0, 10, 10, 10);
        container.addChild(flag);
      } else if(flag) {
        flag = new Icon(color, 0, 0);
        flag.name = 'flag';
        this.addChild(flag);
      }
    }

    let textField = container.getChildByName('text');
    if (!textField) {
      textField = new TextField(text, 'left', 'middle', NODE_FLAG_FONT_STYLE, NODE_FLAG_FONT_COLOR, 20, 15);
      textField.name = 'text';
      this.addChild(textField);
    }

    super.render();
  }
}
