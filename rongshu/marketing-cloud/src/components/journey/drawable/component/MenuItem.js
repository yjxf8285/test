import createjs from 'EaselJS';
import Element from '../Element';

import override from 'core-decorators/lib/override';
import autobind from 'core-decorators/lib/autobind';

const MENU_ITEM_RADIUS = 20;
const HOVER_COLOR = '#FFF';
const NORMAL_COLOR = '#009688';

export default class MenuItem extends Element {
  type = 'menu item';

  constructor(icons, x, y, tooltip) {
    const props = {
      icons,
      x, y,
    };
    const container = new createjs.Container();

    icons[1].setVisiable(false);

    super(props, container);

    container.addEventListener('click', this.handleClick);
    container.addEventListener('mouseover', this.handleEnter);
    container.addEventListener('mouseout', this.handleOut);

    this.tooltip = tooltip;
  }

  @autobind
  handleClick() {
    console.info('MenuItem click');
    const { onClick } = this.props;
    onClick && onClick();
  }

  @autobind
  handleEnter() {
    console.info('MenuItem mouseover');
    const item = this.context.getChildByName('item');
    item.copyGraphics = item.graphics.clone();
    item
      .graphics
      .clear()
      .beginFill(HOVER_COLOR)
      .drawCircle(0, 0, MENU_ITEM_RADIUS);

    const { icons: [ normal, hover ] } = this.props;
    normal.setVisiable(false);
    hover.setVisiable(true);

    if (this.tooltip)
      this.tooltip.setVisiable(true);
  }

  @autobind
  handleOut() {
    console.info('MenuItem mouseout');
    const item = this.context.getChildByName('item');
    item.graphics = item.copyGraphics;

    const { icons: [ normal, hover ] } = this.props;
    normal.setVisiable(true);
    hover.setVisiable(false);

    if (this.tooltip)
      this.tooltip.setVisiable(false);
  }

  @override
  render() {
    const { icons, x, y } = this.props;
    const container = this.context;

    container.x = x;
    container.y = y;

    let item = container.getChildByName('item');
    if (!item) {
      item = new createjs.Shape();
      item.name = 'item';
      item
        .graphics
        .beginFill(NORMAL_COLOR)
        .drawCircle(0, 0, MENU_ITEM_RADIUS);

      container.addChild(item);

      icons.forEach(item => this.addChild(item));
    }

    let tooltip = container.getChildByName('tooltip');
    if (!tooltip) {
      this.tooltip.name = 'tooltip';
      this.addChild(this.tooltip);
    }

    super.render();
  }
}
