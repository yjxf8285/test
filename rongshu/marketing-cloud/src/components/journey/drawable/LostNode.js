import createjs from 'EaselJS';

import Element from './Element';
import TextField from './component/TextField';
import Pie from './component/Pie';
import Icon from './component/Icon';
import Label from './component/Label';

import override from 'core-decorators/lib/override';
import autobind from 'core-decorators/lib/autobind';

import compose from 'ramda/src/compose';
import filter from 'ramda/src/filter';
import map from 'ramda/src/map';
import reduce from 'ramda/src/reduce';
import omit from 'ramda/src/omit';
import ap from 'ramda/src/ap';
import assoc from 'ramda/src/assoc';
import sum from 'ramda/src/sum';

import {
  PERSENT_FORMAT,
  NUMBER_FORMAT,
  RADIUS,
  TO_NUMBER,
  NODE_FLAG_FONT_STYLE,
  NODE_FLAG_FONT_COLOR,
  DROPPED,
  PRESENT,
} from '../constants/define';

import LABEL_ICON_PERSON_BITMAP from '../../../assets/images/journey/person.png';

const FILE_NAME = 'src/components/journey/drawable/LostNode.js';
const getPickItemSum = compose(
  sum,
  map(({ value }) => value),
  filter(({ isImportant }) => isImportant),
);

// Example:
// {
//   props: {
//     nodeId: 0,
//     name: '海报 - 二维码',
//     data: [
//       {
//         type: 'present',
//         value: 30,
//         label: '0.003k',
//         color: '#80DEEA',
//         isImportant: true,
//       },
//     ],
//   }
// }

const createLabel = (container) => (offsetY, { label, color }) => ( 
  container.addChild(new Label(label, color, 498, offsetY)),
  offsetY + 18 // space of text line
);

const pickPredicate = i => i.type === DROPPED || i.type === PRESENT;
const othersPredicate = i => i.type !== DROPPED && i.type !== PRESENT;
const pickDataFilter = filter(pickPredicate)
const otherDataFilter = filter(othersPredicate);
const assocImportant = ap([assoc('isImportant', true)]);
const upgrade = compose(assocImportant, pickDataFilter);

export default class LostNode extends Element {
  type = 'lost node';

  hasDrawText = false;
  hasDrawPie = false;
  hasDrawFlag = false;

  constructor(props) {
    const container = new createjs.Container();
    const newProps = omit(['children'], props);

    const newData = upgrade(newProps.data);
    const finalProps = {
      ...newProps,
      data: [
        ...otherDataFilter(newProps.data),
        ...newData,
      ],
    };

    super(finalProps, container);
  }

  @autobind
  drawPie() {
    if (this.hasDrawPie) return;

    this.hasDrawPie = true;

    const { name, data, filters } = this.props;

    this.addChild(new TextField(name, 'center', 'top', 'normal 14px Arial', '#333', 429, 20));
    this.addChild(new Pie(data, filters, 429 - RADIUS, 92 - RADIUS, RADIUS, void 0, true));
  }

  @autobind
  drawFlag() {
    if (this.hasDrawFlag) return;

    this.hasDrawFlag = true;

    const { data = [], person } = this.props;
    const newData = [
      {
        label: person,
        color: '',
      },
      ...data,
    ]
    const reduceData = reduce(createLabel(this), 30);

    reduceData(newData);

    const offset = 48;
    this.addChild(new Icon(LABEL_ICON_PERSON_BITMAP, 505, offset - 4));
  }

  @autobind
  drawText() {
    if (this.hasDrawText) return;

    this.hasDrawText = true;

    const { data = [], person } = this.props;
    const sum = getPickItemSum(data);

    let total = TO_NUMBER(person);

    if (isNaN(total) || total === 0) throw new RangeError('person can\'t be zero in drawText method', FILE_NAME);

    // 4000K
    this.addChild(new TextField(NUMBER_FORMAT(sum), 'left', 'top', 'normal 36px Arial', '#666', 68, 42));
    // [7.8$]
    this.addChild(new TextField(`[${ PERSENT_FORMAT(sum / total) }]`, 'left', 'top', 'normal 18px Arial', '#666', 68 + data.length * 20 + 10, 55));
    // 流失率
    this.addChild(new TextField('流失率', 'left', 'top', 'bold 14px Arial', '#666', 68, 85));
    // (估值)
    this.addChild(new TextField('(估值)', 'left', 'top', 'bold 14px Arial', '#999', 122, 85));
  }

  @override
  render() {
    // 那条折线不会画
    this.context.x = 0;
    this.context.y = 0;

    this.drawText();
    this.drawPie();
    this.drawFlag();

    super.render();
  }
}
