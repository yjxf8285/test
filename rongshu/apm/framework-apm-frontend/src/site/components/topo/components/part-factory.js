
import TopoUtil from '../util/topo-util'
import ImgNode from './node/img-node'
import Link from './link/link'
import CircleNode from './node/circle-node'

function createPart (root, data, options) {
  let part = null
  switch (data.nodeType) {
    case TopoUtil.IMG_TYPE:
      part = new ImgNode(root, data, options)
      break
    case TopoUtil.CIRCLE_TYPE:
      part = new CircleNode(root, data, options)
      break
    case TopoUtil.LINK_TYPE:
      part = new Link(root, data, options)
  }
  return part
}

export default { createPart }
