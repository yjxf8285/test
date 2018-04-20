import GridLayout from './grid-layout'

var setLayout = function (name, data, width, height) {
  let layout = null
  switch (name) {
    case 'grid':
      layout = new GridLayout(width, height, data)
      break
  }
  return layout
}

export default {setLayout}
