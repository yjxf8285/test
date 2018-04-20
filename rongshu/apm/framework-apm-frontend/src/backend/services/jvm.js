module.exports = app => {
  return {
    '/api/server/v2/jvm/classBlockMemory': app.modules.common.biteToMb,
    '/api/server/v2/jvm/classMemory': app.modules.common.biteToMb,
    '/api/server/v2/jvm/jrockit/oldspace': app.modules.common.biteToMb,
    '/api/server/v2/jvm/jrockit/nursery': app.modules.common.biteToMb,
    '/api/server/v2/jvm/jrockit/noheapUsed': app.modules.common.biteToMb,
    '/api/server/v2/jvm/jrockit/heapUsed': app.modules.common.biteToMb,
    '/api/server/v2/jvm/heapUsed': app.modules.common.biteToMb,
    '/api/server/v2/jvm/edenSpace': app.modules.common.biteToMb,
    '/api/server/v2/jvm/survivorSpace': app.modules.common.biteToMb,
    '/api/server/v2/jvm/oldGen': app.modules.common.biteToMb,
    '/api/server/v2/jvm/codeCache': app.modules.common.biteToMb,
    '/api/server/v2/jvm/metaspace': app.modules.common.biteToMb,
    '/api/server/v2/jvm/permGen': app.modules.common.biteToMb
  }
}
