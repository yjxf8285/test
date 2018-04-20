import createjs from 'EaselJS';
import Element from '../Element';

import override from 'core-decorators/lib/override';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

export default class TextField extends Element {
  type = "text field";

  constructor(
    text,
    textAlign,
    textBaseline,
    style,
    color,
    x,
    y,
) {
    const textField = new createjs.Text(text, style, color);
    const props = {
      textAlign,
      textBaseline,
      x,
      y,
    };

    super(props, textField);

    this.click$ = Observable
      .fromEvent(this.context, 'click')
      .subscribe((e) => {
        const { onClick } = this.props;
        onClick && onClick();
      });
  }

  set color(color) {
    this.context.color = color;
  }

  @override
  render() {
    const { textAlign, textBaseline, x, y } = this.props;
    this.context.textAlign = textAlign;
    this.context.textBaseline = textBaseline;
    this.context.x = x;
    this.context.y = y;

    super.render();
  }

  @override
  unMount() {
    this.click$.unsubscribe();
    this.click$ = void 0;
  }
}
