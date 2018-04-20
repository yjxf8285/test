import createjs from 'EaselJS';
import Element from './Element';

import override from 'core-decorators/lib/override';
import autobind from 'core-decorators/lib/autobind';

export default class LostStage extends Element {
  type = 'lost stage';

  constructor(canvas) {
    const stage = new createjs.Stage(canvas);
    const props = {};

    super(props, stage);

    this.context.clear();
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = canvas.parentNode.offsetHeight;
  }

  @override
  render() {
    super.render();
    this.context.update();
  }
}
