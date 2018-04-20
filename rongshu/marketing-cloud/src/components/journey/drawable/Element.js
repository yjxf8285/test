import pathEq from 'ramda/src/pathEq';
import findIndex from 'ramda/src/findIndex';
import __ from 'ramda/src/__';
import remove from 'ramda/src/remove';
import compose from 'ramda/src/compose';
import ap from 'ramda/src/ap';
import pathOr from 'ramda/src/pathOr';
import filter from 'ramda/src/filter';

const trace = x => (console.info(x), x);

const renderChildren = compose(
  ap([i => i.render()]),
  pathOr([], ['props', 'children']),
);

const unMountChildren = compose(
  ap([i => i.unMount()]),
  pathOr([], ['props', 'children']),
);

export default class Element {

  props = {
    children: [],
    parent: null,
  };
  context = null;

  get children() {
    return this.props.children;
  }

  get parent() {
    return this.props.parent;
  }
  set parent(parent) {
    this.props.parent = parent;

    return this;
  }

  get name() {
    return this.context.name;
  }
  set name(name) {
    this.context.name = name;

    return this;
  }

  set alpha(alpha) {
    this.context.alpha = alpha;

    return this;
  }

  constructor(props, context) {
    // TODO: initialize Node instance
    this.context = context;
    this.props = {
      ...this.props,
      ...props,
    };
  }

  addChild(node) {
    if (!(node instanceof Element)) 
      throw new TypeError('child must be an Element');

    node.parent = this;

    this.context.addChild(node.context);
    this.props.children.push(node);

    return this;
  }

  removeChild(node) {
    this.context.removeChild(node.context);

    const { props: { nodeId } } = node;
    const predicate = pathEq(['props', 'nodeId'], nodeId);
    const findNodeIndex = findIndex(predicate);
    const removeChild = remove(__, 1, this.props.children);
    const removeNode = compose(
      removeChild,
      findNodeIndex
    );

    this.props.children = removeNode(this.props.children);

    return this;
  }

  setVisiable(visiable) {
    if (!this.context.originAlpha)
      this.context.originAlpha = this.context.alpha;

    if (visiable) {
      this.context.alpha = this.context.originAlpha;
    } else {
      this.context.alpha = 0;
    }
  }

  render() {
    //console.log(`${ this.type } render`);
    renderChildren(this);
  }

  unMount() {
    unMountChildren(this);
  }
}
