import createjs from 'EaselJS';
import Node from './Node';
import Pie from './component/Pie';
import Icon from './component/Icon';
import TextField from './component/TextField';

import override from 'core-decorators/lib/override';
import autobind from 'core-decorators/lib/autobind';

import EVENT_NODE_SELECTED from '../event/NodeSelectedEvent';

import CHECKBOX_HOVER_BITMAP from '../../../assets/images/journey/checkbox-hover.png';
import CHECKBOX_CHECKED_BITMAP from '../../../assets/images/journey/checkbox-checked.png';
import CHECKBOX_NORMAL_BITMAP from '../../../assets/images/journey/checkbox-normal.png';

import {
  LINE_HEIGHT,
  RADIUS,
  WIDTH_UNIT_LIMIT,
  NODE_NAME_FONT_STYLE,
  NODE_NAME_FONT_COLOR,
  NODE_COLORS,
  DARK_COLOR,
} from '../constants/define';

const DEFAULT_COLOR = '#CCC';

export default class CompareNode extends Node {

  type = 'compare node';
  isChecked = false;
  checkedColor = void 0;
  unCheckedColor = void 0;
  isHovered = false;

  constructor(props) {
    const { yIndex, canChecked } = props;
    super(props);

    if (canChecked) {
      const color = NODE_COLORS(yIndex);
      this.checkedColor = color();
      this.unCheckedColor = DARK_COLOR(color());
      console.info(this.checkedColor, this.unCheckedColor);
    }
  }

  @autobind
  handlePieClick() {
    this.isChecked = !this.isChecked;
    this.render();

    const event = EVENT_NODE_SELECTED();
    event.node = this.props;
    event.isChecked = this.isChecked;
    this.context.stage.canvas.dispatchEvent(event);
  }

  @autobind
  handlePieHover() {
    console.info('hover show')
    this.isHovered = true;
    this.render();
  }

  @autobind
  handlePieOut() {
    console.info('hover hide')
    this.isHovered = false;
    this.render();
  }

  @override
  @autobind
  drawPie() {
    const { filters, canChecked } = this.props;
    const container = this.context;
    const color = canChecked ? this.isChecked ? this.checkedColor : this.unCheckedColor : DEFAULT_COLOR;

    let pie = container.getChildByName('pie');
    container.removeChild(pie);

    pie = new Pie([], filters, (WIDTH_UNIT_LIMIT - 2 * RADIUS) / 2, LINE_HEIGHT, RADIUS, color);
    pie.name = 'pie';
    pie.hasShadow = canChecked;

    if (canChecked) {
      pie.props.onClick = this.handlePieClick;
      pie.props.onHover = this.handlePieHover;
      pie.props.onOut = this.handlePieOut;
    }

    this.addChild(pie);
  }

  @override
  @autobind
  drawTitleText() {
    const { name } = this.props;
    const container = this.context;
    let textOfName = container.getChildByName('textOfName');
    if (!textOfName) {
      textOfName = new TextField(name, 'left', 'middle', NODE_NAME_FONT_STYLE, NODE_NAME_FONT_COLOR, 15, LINE_HEIGHT / 2);
      textOfName.name = 'textOfName';
      textOfName.props.onClick = this.handlePieClick;
      this.addChild(textOfName);
    }
  }

  @override
  @autobind
  drawFlag() {
    // TODO: nothing to do
  }

  @override
  render() {
    const container = this.context;
    const { canChecked } = this.props;

    this.alpha = this.isChecked ? 1 : 0.9;

    let polys = this.context.getChildByName('polys');
    if (!polys) {
      polys = new createjs.Shape();
      polys.name = 'polys';
      polys
        .graphics
        .beginFill('#333')
        .drawPolyStar(
          WIDTH_UNIT_LIMIT / 2 + RADIUS + 4, 
          LINE_HEIGHT + RADIUS, 
          8, 
          3, 
          0, 
          0);

      this.context.addChild(polys);
    }
    polys.alpha = this.isChecked ? 1 : 0;

    const iconOffsetX = 0;

    if (canChecked) {
      let checkbox = container.getChildByName('checkbox-checked');
      if (!checkbox) {
        checkbox = new Icon(CHECKBOX_CHECKED_BITMAP, iconOffsetX, LINE_HEIGHT / 2);
        checkbox.name = 'checkbox-checked';
        checkbox.alpha = 0;
        checkbox.props.onClick = this.handlePieClick;
        this.addChild(checkbox);
      }
      checkbox.alpha = this.isChecked ? 1 : 0;

      checkbox = container.getChildByName('checkbox-normal');
      if (!checkbox) {
        checkbox = new Icon(CHECKBOX_NORMAL_BITMAP, iconOffsetX, LINE_HEIGHT / 2);
        checkbox.name = 'checkbox-normal';
        checkbox.alpha = 0;
        checkbox.props.onClick = this.handlePieClick;
        this.addChild(checkbox);
      }
      checkbox.alpha = !this.isChecked && !this.isHovered ? 1 : 0;

      checkbox = container.getChildByName('checkbox-hover');
      if (!checkbox) {
        checkbox = new Icon(CHECKBOX_HOVER_BITMAP, iconOffsetX, LINE_HEIGHT / 2);
        checkbox.name = 'checkbox-hover';
        checkbox.alpha = 0;
        checkbox.props.onClick = this.handlePieClick;
        this.addChild(checkbox);
      }
      checkbox.alpha = !this.isChecked && this.isHovered ? 1 : 0;
    }

    super.render();
  }
}
