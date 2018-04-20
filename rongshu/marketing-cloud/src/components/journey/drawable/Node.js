import createjs from 'EaselJS';

import Element from './Element';
import TextField from './component/TextField';
import Pie from './component/Pie';
import Label from './component/Label';
import Menu from './component/Menu';
import MenuItem from './component/MenuItem';
import Icon from './component/Icon';
import Cover from './component/Cover';
import Tooltip, { POSITION } from './component/Tooltip';

import EVENT_PRE_COMPARE from '../event/PreCompareEvent';
import EVENT_LOST_ANALYSIS from '../event/LostAnalysisEvent';
import EVENT_SHOW_MENU from '../event/ShowMenuEvent';
import EVENT_NORMAL from '../event/NormalEvent';

import { 
  DEBUG_COLOR, 
  DEBUG, 
  WIDTH_UNIT_LIMIT, 
  HEIGHT_UNIT_LIMIT,
  LINE_HEIGHT,
  NODE_NAME_FONT_STYLE,
  NODE_NAME_FONT_COLOR,
  X_INDEX_TO_PX,
  Y_INDEX_TO_PX,
  RADIUS,
  FLAG_MAPS,
  NUMBER_FORMAT,
  TO_NUMBER,
} from '../constants/define';

import override from 'core-decorators/lib/override';
import autobind from 'core-decorators/lib/autobind';

import MENU_ITEM_COMPARE_NORMAL_BITMAP from '../../../assets/images/journey/compare-normal.png'
import MENU_ITEM_COMPARE_HOVER_BITMAP from '../../../assets/images/journey/compare-hover.png';
import MENU_ITEM_LOST_NORMAL_BITMAP from '../../../assets/images/journey/lost-normal.png';
import MENU_ITEM_LOST_HOVER_BITMAP from '../../../assets/images/journey/lost-hover.png';
import LABEL_ICON_PERSON_BITMAP from '../../../assets/images/journey/person.png';

import omit from 'ramda/src/omit';

const FILE_NAME = 'src/components/journey/drawable/Node.js';

export default class Node extends Element {

  type = 'node';
  
  constructor({ 
    nodeId,
    nodeName, 
    behaviorStatus = [], 
    filters = [], 
    total = 0,
    xIndex, 
    yIndex,
    canChecked,
    canClicked,
  }, context) {
    const container = context || new createjs.Container();
    const props = {
      x: xIndex,
      y: yIndex,
      name: nodeName,
      data: behaviorStatus.filter(({ value }) => value > 0),
      nodeId,
      filters,
      person: total,
      canChecked,
      canClicked,
    };

    super(props, container);
  }

  @autobind
  handlePieClick() {
    console.info('pie click')
    const container = this.context;
    const stageRoot = this.context.stage;
    const plainNode = { props: omit(['children'], this.props) };

    const cover = new Cover(0, 0);
    stageRoot.addChild(cover.context);
    cover.setVisiable(true);
    cover.render();

    let tooltip = new Tooltip(-24, -70, 48, 32, POSITION.TOP, false);
    tooltip.title = '对比';
    tooltip.setVisiable(false);
    tooltip.color = '#CCC';
    tooltip.backgroundColor = '#000';
    tooltip.alpha = 0.5;
    const compareMenuItem = new MenuItem([
      new Icon(MENU_ITEM_COMPARE_NORMAL_BITMAP, 0, 0),
      new Icon(MENU_ITEM_COMPARE_HOVER_BITMAP, 0, 0),
    ], 0, -75, tooltip);
    compareMenuItem.props.onClick = () => {
      const event = EVENT_PRE_COMPARE();
      event.node = plainNode;
      stageRoot.canvas.dispatchEvent(event);
    };
    tooltip = new Tooltip(-37, 37, 76, 32, POSITION.BOTTOM, false);
    tooltip.title = '流失分析';
    tooltip.color = '#CCC';
    tooltip.backgroundColor = '#000';
    tooltip.setVisiable(false);
    tooltip.alpha = 0.5;
    const lostMenuItem = new MenuItem([
      new Icon(MENU_ITEM_LOST_NORMAL_BITMAP, 0, 0),
      new Icon(MENU_ITEM_LOST_HOVER_BITMAP, 0, 0),
    ], 0, 75, tooltip);
    lostMenuItem.props.onClick = () => {
      const event = EVENT_LOST_ANALYSIS();
      event.node = plainNode;
      stageRoot.canvas.dispatchEvent(event);
    };
    const menu = new Menu(
      [
        compareMenuItem,
        lostMenuItem,
      ], 
      container.x + WIDTH_UNIT_LIMIT / 2,
      container.y + LINE_HEIGHT + RADIUS,
      RADIUS
    );
    stageRoot.addChild(menu.context);
    menu.setVisiable(true);
    menu.render();

    const event = EVENT_SHOW_MENU();
    event.node = plainNode;
    stageRoot.canvas.dispatchEvent(event);

    stageRoot.actions.push(() => {
      stageRoot.removeChild(cover.context);
      stageRoot.removeChild(menu.context);
      stageRoot.update();

      const event = EVENT_NORMAL();
      event.node = plainNode;
      stageRoot.canvas.dispatchEvent(event);
    });
  }

  @autobind
  handlePieHover(targetData) {
    const { type, value } = targetData;
    const { person } = this.props;

    let total = TO_NUMBER(person), persent = 0;

    if (isNaN(total) || total === 0) throw new RangeError('person can\'t be zero in drawText method', FILE_NAME);

    persent = ( value / total * 1000 >> 0 ) / 10;

    if (process.env.NODE_ENV === 'development') {
      console.info(value, person, total, persent);
    }

    // 绘制Tooltip
    this.tooltip = new Tooltip(this.context.x + WIDTH_UNIT_LIMIT + 10, this.context.y + LINE_HEIGHT, WIDTH_UNIT_LIMIT * 2 - 60, RADIUS * 2, POSITION.RIGHT);
    this.tooltip.title = FLAG_MAPS[type];
    this.tooltip.texts = [`人数: ${NUMBER_FORMAT(value)} (${persent}%)`, '点击色块, 下载人群信息'];
    this.tooltip.render();
    this.context.stage.addChild(this.tooltip.context);
  }

  @autobind
  handlePieOut() {
    this.context.stage.removeChild(this.tooltip.context);
  }

  @autobind
  drawPie() {
    const { data, filters, canClicked } = this.props;
    const container = this.context;

    let pie = container.getChildByName('pie');
    if (!pie) {
      pie = new Pie(data, filters, (WIDTH_UNIT_LIMIT - 2 * RADIUS) / 2, LINE_HEIGHT, RADIUS, void 0, canClicked);
      pie.name = 'pie';

      if (canClicked) {
        pie.props.onClick = this.handlePieClick;
        pie.props.onHover = this.handlePieHover;
        pie.props.onOut = this.handlePieOut;
      }

      this.addChild(pie);
    }
  }

  @autobind
  drawFlag() {
    const { data } = this.props;
    const container = this.context;

    let flag;
    data.forEach(({ label, color }, index) => {
      flag = container.getChildByName(`flag_${ index + 1 }`);
      if (!flag) {
        flag = new Label(label, color, 30, (index + 1) * 16 + LINE_HEIGHT + 2 * RADIUS);
        flag.name = `flag_${ index + 1 }`;
        this.addChild(flag);
      }
    });
  }

  @autobind
  drawTitleText() {
    const { name } = this.props;
    const container = this.context;
    let textOfName = container.getChildByName('textOfName');
    if (!textOfName) {
      textOfName = new TextField(name, 'center', 'middle', NODE_NAME_FONT_STYLE, NODE_NAME_FONT_COLOR, WIDTH_UNIT_LIMIT / 2, LINE_HEIGHT / 2);
      textOfName.name = 'textOfName';
      this.addChild(textOfName);
    }
  }

  @override
  render() {
    const { x, y, name, data, filters, person } = this.props;
    const container = this.context;
    let offset = 0;

    container.x = X_INDEX_TO_PX(x);
    container.y = Y_INDEX_TO_PX(y);

    // 绘制标题
    this.drawTitleText();

    offset += LINE_HEIGHT + 2 * RADIUS;

    // 绘制数据标识
    let flag = container.getChildByName('flag_0');
    if (!flag) {
      flag = new Label(person, '', 30, offset);
      flag.name = 'flag_0';
      this.addChild(new Icon(LABEL_ICON_PERSON_BITMAP, 35, offset + 13));
      this.addChild(flag);
    }
    this.drawFlag();

    // 绘制饼图
    this.drawPie();

    super.render();
  }
}
