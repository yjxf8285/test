import compose from 'ramda/src/compose';
import merge from 'ramda/src/merge';

const defaults = merge({
  bubbles: true,
  cancelable: true,
  eventPhase: 2,
});

const createEvent = (options = {}) => new Event('normal', options);

export default compose(
  createEvent,
  defaults,
);
