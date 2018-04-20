const states = [
  'current_application',
  'current_timerange',
  'origin_timerange',
  'application_list'
]
let statesObj = {}
states.forEach(state => {
  statesObj[state] = {
    name: state + '_state',
    event: state + '_state-change'
  }
})
export default statesObj
