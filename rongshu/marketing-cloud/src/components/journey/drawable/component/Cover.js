import createjs from 'EaselJS';

import override from 'core-decorators/lib/override';

import Element from '../Element';

export default class Cover extends Element {
  type = 'cover';

  constructor(x, y) {
    const shape = new createjs.Shape();
    const props = {
      x, y,
    };

    super(props, shape);
  }

  @override
  setVisiable(visiable) {
    this.context.alpha = visiable ? 0.5 : 0;
    super.setVisiable(visiable);
  }

  @override
  render() {
    const { x, y } = this.props;
    const { width, height  } = this.context.stage.canvas;
    const { scaleX, scaleY } = this.context.stage;

    this.context
      .graphics
      .beginFill('#000')
      .drawRect(x, y, width / scaleX, height / scaleY);
  }
}
