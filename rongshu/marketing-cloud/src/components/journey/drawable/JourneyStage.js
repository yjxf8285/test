import createjs from 'EaselJS';
import partial from 'ramda/src/partial';

import { 
  DEBUG_COLOR, 
  DEBUG, 
  WIDTH_UNIT_LIMIT, 
  HEIGHT_UNIT_LIMIT,
  X_INDEX_TO_PX,
  Y_INDEX_TO_PX,
  PADDING,
} from '../constants/define';

import Element from './Element';
import Cover from './component/Cover';

import override from 'core-decorators/lib/override';
import autobind from 'core-decorators/lib/autobind';

const handleClick = (stage, event) => {
  if (event.eventPhase == 1) {
    // TODO: clear action
    const actions = stage.actions;
    let one = null;
    while(one = actions.pop()) {
      one();
    }
    console.info('clear action')
  } else {
    // TODO: process action
    console.info('process action');
  }
};

export default class Stage extends Element {

  type = "stage";

  get canvas() {
    return this.context.canvas;
  }

  constructor(canvas, row, column, scale) {
    const stage = new createjs.Stage(canvas);
    const props = {
      row, 
      column,
    };

    stage.enableMouseOver(17);
    stage.actions = [];
    stage.addEventListener('click', partial(handleClick, [stage]), true);
    stage.addEventListener('click', partial(handleClick, [stage]), false);

    stage.scaleX = scale;
    stage.scaleY = scale;

    super(props, stage);

    {
      const { row, column } = this.props;
      const height =  row * HEIGHT_UNIT_LIMIT;

      this.context.clear();
      this.canvas.height = ( height + PADDING * 2 ) * scale;
      this.canvas.width = ( column * WIDTH_UNIT_LIMIT + PADDING * 2 ) * scale;

      let columnShape = null;
      for (let i = 0; i < column; i++) {
        if (DEBUG) {
          if (i % 2 === 1) {
            const shape = new createjs.Shape();
            shape.x = X_INDEX_TO_PX(i);
            shape.alpha = 0.2;
            shape.graphics.beginFill(DEBUG_COLOR).drawRect(0, PADDING, WIDTH_UNIT_LIMIT, height);
            this.context.addChild(shape);

            for (let j = 0; j < row; j++) {
              const shape = new createjs.Shape();
              shape.x = X_INDEX_TO_PX(i);
              shape.y = Y_INDEX_TO_PX(j);
              shape.graphics.beginStroke(DEBUG_COLOR).drawRect(0, 0, WIDTH_UNIT_LIMIT, HEIGHT_UNIT_LIMIT);
              this.context.addChild(shape);

              const text = new createjs.Text(`${ i } x ${ j }`);
              text.alpha = 0.2;
              text.x = X_INDEX_TO_PX(i);
              text.y = Y_INDEX_TO_PX(j);
              this.context.addChild(text);
            }
          }       
        }

        if (i % 2 === 1)
          continue;

        this.context.addChild(
          createColumnShape(X_INDEX_TO_PX(i), PADDING, WIDTH_UNIT_LIMIT, height, {
            backgroudColor: '#FFF',
          })
        );
      }
    }
  }

  @autobind
  handleTick() {
    this.context.update();
  }

  @override
  render() {
    createjs.Ticker.addEventListener('tick', this.handleTick);

    super.render();
  }

  @override
  unMount() {
    super.unMount();

    this.context.removeAllEventListeners();

    createjs.Ticker.removeAllEventListeners();
  }
}

function createColumnShape(x, y, width, height, style) {
  const columnShape = new createjs.Shape();

  columnShape.x = x;
  columnShape.y = y;
  columnShape
    .graphics
    //.beginFill(style.backgroudColor)
    .drawRect(0, 0, width, height);

  return columnShape;
};
