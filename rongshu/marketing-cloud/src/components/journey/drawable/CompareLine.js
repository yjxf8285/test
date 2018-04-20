import Line from './Line';

export default class CompareLine extends Line {
  type = "compare line";

  constructor(props) {
    const newProps = {
      ...props,
      color: '#ccc',
    };

    super(newProps);
  }
};
