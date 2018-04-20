import createjs from 'EaselJS';
import compose from 'ramda/src/compose';
import reduce from 'ramda/src/reduce';
import map from 'ramda/src/map';
import addIndex from 'ramda/src/addIndex';
import sum from 'ramda/src/sum';

import Element from '../Element';
import Icon from './Icon';

import {
  SHADOW
} from '../../constants/define';

import BITMAP_FILTER_ICON from '../../../../assets/images/journey/filter.png';

import autobind from 'core-decorators/lib/autobind';
import override from 'core-decorators/lib/override';

import pathOr from 'ramda/src/pathOr';
import clamp from 'ramda/src/clamp';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';

const createObservable = (action) => (targetRef) => Observable.fromEvent(targetRef, action);
const clickObservable = createObservable('click');
const mouseoverObservable = createObservable('mouseover');
const mouseoutObservable = createObservable('mouseout');

const sumOfData = compose(
  sum,
  map(item => item.value)
);

const SPACE = 2 * Math.PI * 0.008;
const MIN_RADIAN = 3 * SPACE; // 不能小于三倍线宽, 否则会有精度问题带来的计算错误

const buildPie = (datasource) => (container, rx, ry, radius) => (sum) => {
  const reduceIndexed = addIndex(reduce);
  const draw = reduceIndexed((startRadian, { value, color, isImportant = false }, index) => {
    const radian = 2 * Math.PI * value / sum;
    const endRadian = startRadian + radian;

    if (radian < MIN_RADIAN)
      return endRadian;

    const name = `pie_${ index }`;
    let pie = container.getChildByName(name)
    if (!pie) {
      pie = new createjs.Shape();
      pie.name = name;
      pie.color = color;
      pie.tag = {
        color,
        rx, ry, radius,
        startRadian,
        endRadian,
        SPACE,
        index,
      };
      container.addChild(pie);
    }

    if (isImportant) {
      pie 
        .graphics
        .clear()
        .beginFill(color)
        .moveTo(rx, ry)
        .arc(rx, ry, radius + 10, startRadian, endRadian - SPACE)
        .lineTo(rx, ry);
    } else {
      pie
        .graphics
        .clear()
        .beginFill(color)
        .moveTo(rx, ry)
        .arc(rx, ry, radius, startRadian, endRadian - SPACE)
        .moveTo(rx, ry);
    }
    return endRadian;
  }, -0.5 * Math.PI);

  return draw(datasource);
};

export default class Pie extends Element {
  type = 'pie';

  constructor(datasource, filters, x, y, radius, color = '#CCC', hasMutual = true) {
    const container = new createjs.Container();
    const props = {
      datasource,
      filters,
      x,
      y,
      radius,
      color,
      hasMutual,
    };

    super(props, container);

    this.filterClick$ = clickObservable(container)
      .map(e => e.target)
      .filter(t => !t.tag)
      .subscribe(this.handleFilterClick);

    if (hasMutual) {
      this.pieHover$ = mouseoverObservable(container)
        .map(e => e.target)
        .filter(t => t.tag)
        .subscribe(this.handlePieHover);
      this.pieOut$ = mouseoutObservable(container)
        .map(e => e.target)
        .filter(t => t.tag)
        .subscribe(this.handlePieOut);
    }
  }

  set hasShadow(has) {
    this.shadow = has ? SHADOW : null;
  }

  @autobind
  handlePieClick(container) {
    const { onClick } = this.props;
    onClick && onClick(container);
  }

  @autobind
  handlePieOut(shape) {
    const copyGraphics = shape.copyGraphics;
    shape.graphics = copyGraphics;
    shape.shadow = null;

    const { onOut } = this.props;
    onOut && onOut();
  }

  @autobind
  handlePieHover(shape) {
    const { color, rx, ry, radius, startRadian, endRadian, SPACE, index } = shape.tag;
    shape.copyGraphics = shape.graphics.clone();
    shape.shadow = SHADOW;
    shape
      .graphics
      .clear()
      .beginFill(color)
      .moveTo(rx, ry)
      .arc(rx, ry, radius + 10, startRadian, endRadian - SPACE)
      .lineTo(rx, ry);

    const { onHover, datasource } = this.props;
    onHover && onHover(datasource[index]);
  }

  @autobind
  handleFilterClick(container) {
    const { onClick } = this.props;
    onClick && onClick(container);
  }

  @autobind
  handleFilterHover(event) {
    console.info(event.type);
  }

  @override
  render() {
    const { datasource, filters, x, y, radius, color } = this.props;
    const container = this.context;

    container.x = x;
    container.y = y;

    let pieArea = container.getChildByName('pieArea');
    if (!pieArea) {
      pieArea = new createjs.Shape();
      pieArea.name = 'pieArea';
      pieArea.shadow = this.shadow;
      container.addChild(pieArea);
    }

    pieArea
      .graphics
      .beginFill('#FFF')
      .drawCircle(radius, radius, radius);

    if (datasource.length < 2) {
      let alonePie = container.getChildByName('alonePie');
      if (!alonePie) {
        alonePie = new createjs.Shape();
        alonePie.alpha = datasource.length === 1 ? 1 : 0.9;
        alonePie.name = 'alonePie';
        container.addChild(alonePie);
      }

      alonePie
        .graphics
        .beginFill(pathOr(color, ['0', 'color'], datasource))
        .drawCircle(radius, radius, radius);
    } else {
      const into = buildPie(datasource);
      const drawWithSum = into(container, radius, radius, radius);
      const drawPie = compose(drawWithSum, sumOfData);

      drawPie(datasource);
    }

    let filterContainer = container.getChildByName('filterContainer');
    if (!filterContainer) {
      filterContainer = new createjs.Container();
      filterContainer.name = 'filterContainer';
      container.addChild(filterContainer);

      const shape = new createjs.Shape();
      shape
        .graphics
        .beginFill('#FFF')
        .drawCircle(radius, radius, radius - 20);
      filterContainer.addChild(shape);
    }

    filterContainer.children
      .filter((n, i) => i > 0)
      .forEach(n => filterContainer.removeChild(n));

    let center = null;
    if (filters.length === 0) {
      center = new createjs.Shape();
      center
        .graphics
        .beginFill('#666')
        .drawCircle(radius, radius, 9);
      filterContainer.addChild(center);

    } else {
      center = new Icon(BITMAP_FILTER_ICON, radius, radius);
      filterContainer.addChild(center.context);
    }

    super.render();
  }

  @override
  unMount() {
    if (this.pieOut$)
      this.pieOut$.unsubscribe();
    if (this.pieHover$)
      this.pieHover$.unsubscribe();
    if (this.filterClick$)
      this.filterClick$.unsubscribe();
  }
}
