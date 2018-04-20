import createjs from 'EaselJS';
import Element from './Element';
import TextField from './component/TextField';
import Pie from './component/Pie';
import Icon from './component/Icon';

import isEmpty from 'ramda/src/isEmpty';

import override from 'core-decorators/lib/override';
import autobind from 'core-decorators/lib/autobind';

import LABEL_ICON_PERSON_BITMAP from '../../../assets/images/journey/person.png';

import {
  NODE_FLAG_FONT_STYLE,
  NODE_FLAG_FONT_COLOR,
  NUMBER_FORMAT,
} from '../constants/define';

const TITLE_STYLE = 'normal 16px Arial';
const TITLE_COLOR = '#666';
const RADIUS = 38;

export default class Top4Stage extends Element {
  type = 'top4 stage';

  constructor(canvas) {
    const props = {};
    const stage = new createjs.Stage(canvas);

    super(props, stage);

    this.context.clear();
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = canvas.parentNode.offsetHeight;
  }

  set datasource(ds) {
    this.props.datasource = ds;
  }

  set dropped(dp) {
    this.props.dropped = dp;
  }

  @override
  render() {
    console.info('yes')
    const { datasource = [], dropped } = this.props;
    this.addChild(new TextField('(可能)流失用户进行以下行为:', 'left', 'top', TITLE_STYLE, TITLE_COLOR, 30, 20));

    if (datasource.length > 0) {
      const width = this.context.canvas.width;
      const unit = width / datasource.length;

      datasource.reduce((offsetX, { behaviorName: name, count  }) => {
        // 标题
        this.addChild(new TextField(name, 'center', 'top', TITLE_STYLE, TITLE_COLOR, offsetX, 57));
        // 指标
        this.addChild(new TextField(NUMBER_FORMAT(count), 'left', 'top', NODE_FLAG_FONT_STYLE, NODE_FLAG_FONT_COLOR, offsetX + 5, 170));
        this.addChild(new Icon(LABEL_ICON_PERSON_BITMAP, offsetX - 15, 175));
        // 图形
        this.addChild(new Pie([{
          value: count,
          color: '#999',
        }, {
          value: dropped - count,
          color: '#ccc',
        }], [], offsetX - RADIUS, 120 - RADIUS, RADIUS));

        console.info(count, dropped - count);

        return offsetX + unit;
      }, unit / 2);
    }

    super.render();

    this.context.update();
  }
}
