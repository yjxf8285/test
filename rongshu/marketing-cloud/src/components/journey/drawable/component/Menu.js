import createjs from 'EaselJS';

import override from 'core-decorators/lib/override';

import Element from '../Element';

export default class Menu extends Element {
  type = 'menu';
  isVisiable = false;

  constructor(menuItems, x, y, radius) {
    const container = new createjs.Container();
    const props = {
      menuItems,
      x, y,
      radius,
    };

    super(props, container);

    this.setVisiable(this.isVisiable);
  }

  @override
  render() {
    const { menuItems, x, y, radius } = this.props;
    const container = this.context;

    container.x = x;
    container.y = y;

    let panel = container.getChildByName('menu');
    if (!panel) {
      panel = new createjs.Shape();
      panel.name = 'menu';
      panel.alpha = 0.5;

      panel
        .graphics
        .setStrokeStyle(34)
        .beginStroke('#000')
        .arc(0, 0, radius + 17, 0, 2 * Math.PI);

      container.addChild(panel);

      menuItems.forEach(item => this.addChild(item));
    }

    let cover = container.getChildByName('cover');
    if (!cover) {
      cover = new createjs.Shape();
      cover.name = 'cover';
      cover.alpha = 0.5;

      cover
        .graphics
        .beginFill('#FFF')
        .drawCircle(0, 0, radius);

      container.addChild(cover);
    }

    super.render();
  }
}
