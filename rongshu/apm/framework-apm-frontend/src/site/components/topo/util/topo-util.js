
let TopoUtil = {
  IMG_TYPE: 'image',
  CIRCLE_TYPE: 'circle',
  LINK_TYPE: 'link',
  NODE_RADIUS: 35,
  NODE_INNER_RADIUS: 22,
  NODE_ATTACHMENT_RADIUS: 15,
  NODE_ATTACHMENT_COLOR: '#338cff',
  LINK_TYPE_LINE: 'line',
  LINK_TYPE_DASH: 'dash',
  LINK_TYPE_BEZER: 'bezer',
  LINK_ARROW_LENGTH: 8,
  CIRCLE_COLOR: {
    // 健康
    'HEALTHY': '#a9d86e',
    // 容忍
    'NORMAL': '#86cae4',
    // 错误
    'INTOLERANCE': '#f58210',
    // 跨APP调用
    'crossApp': '#8b97a3'
  },
  // 求直接斜率 start：起点  end: 终点
  getlinek: function (start, end) {
    if (end.x === start.x) return false
    return (end.y - start.y) / (end.x - start.x)
  },
  // 求直线上一点坐标 k:直线斜率，point:已知点， length: 未知点距已知点距离， direction: 正向/负向 这种点可以求出两个，因此需要传递方向，默认为正向1，负向为-1
  getPointByLine: function (k, length, point, direction) {
    if (k === false) {
      return { x: point.x, y: point.y - direction * length }
    }
    let x = point.x + direction * (length / Math.sqrt(Math.pow(k, 2) + 1))
    let y = point.y + direction * (k * length / Math.sqrt(Math.pow(k, 2) + 1))
    return { x: x, y: y }
  },
  // 获取贝塞尔曲线上某一点坐标
  getBeZerPoint: function (csource, ctarget, bezer, t) {
    // 根据公式 B(t)=(1 - t)^2 P0 + 2 t (1 - t) P1 + t^2 P2 进行计算
    let x =
      Math.pow(1 - t, 2) * csource.x +
      2 * t * (1 - t) * bezer.x +
      Math.pow(t, 2) * ctarget.x
    let y =
      Math.pow(1 - t, 2) * csource.y +
      2 * t * (1 - t) * bezer.y +
      Math.pow(t, 2) * ctarget.y
    return { x: x, y: y }
  },
  // 计算二次贝塞尔曲线长度
  getBeZerLength: function (csource, ctarget, bezer) {
    // 首先根据公式a = P0 -2*P1 + P2  b = 2*P1 - 2P0  求出a,b两点
    let ax = csource.x - 2 * bezer.x + ctarget.x
    let ay = csource.y - 2 * bezer.y + ctarget.y
    let bx = 2 * bezer.x - 2 * csource.x
    let by = 2 * bezer.y - 2 * csource.y
    // 然后根据公式求出ABC三个常数  A = 4 * (ax^2 + by^2)  B = 4 * (ax* by + ay* by)  C = bx^2 + by^2
    let A = 4 * (ax * ax + ay * ay)
    let B = 4 * (ax * bx + ay * by)
    let C = bx * bx + by * by
    // 最后利用一个起级复杂公式求得贝塞尔曲线的长度公式
    let t = 1

    let len =
        1 /
        (8 * Math.pow(A, 3 / 2)) *
        (2 *
          Math.sqrt(A) *
          (2 * A * t * Math.sqrt(A * t * t + B * t + C) +
            B * (Math.sqrt(A * t * t + B * t + C) - Math.sqrt(C))) +
          (B * B - 4 * A * C) *
            (Math.log(B + 2 * Math.sqrt(A * C)) -
              Math.log(
                B +
                  2 * A * t +
                  2 * Math.sqrt(A) * Math.sqrt(A * t * t + B * t + C)
              )))
    return len
  }
}

export default TopoUtil
