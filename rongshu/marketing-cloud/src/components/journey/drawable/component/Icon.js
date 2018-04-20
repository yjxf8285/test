import createjs from 'EaselJS';
import Element from '../Element';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import override from 'core-decorators/lib/override';

export default class Icon extends Element {
  type = 'icon';

  constructor(uri, x, y) {
    const image = new Image();
    const bitmap = new createjs.Bitmap(image);

    image.src = uri;
    image.addEventListener('load', (event) => {
      bitmap.x = x - event.target.width / 2;
      bitmap.y = y - event.target.height / 2;

      if (bitmap.stage)
        bitmap.stage.update();
    });

    bitmap.x = -999;
    bitmap.y = -999;

    const props = {
      uri,
      x,
      y,
    };

    super(props, bitmap);

    this.click$ = Observable
      .fromEvent(bitmap, 'click')
      .subscribe((e) => {
        const { onClick } = this.props;
        onClick && onClick();
      });
  }

  @override
  unMount() {
    this.click$.unsubscribe();
    this.click$ = void 0;
  }
}
