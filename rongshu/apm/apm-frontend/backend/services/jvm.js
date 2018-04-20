let modules = require('../modules')

module.exports = {
  '/server/v2/jvm/classBlockMemory': modules.common.biteToMb,
  '/server/v2/jvm/classMemory': modules.common.biteToMb,
  '/server/v2/jvm/jrockit/oldspace': modules.common.biteToMb,
  '/server/v2/jvm/jrockit/nursery': modules.common.biteToMb,
  '/server/v2/jvm/jrockit/noheapUsed': modules.common.biteToMb,
  '/server/v2/jvm/jrockit/heapUsed': modules.common.biteToMb,
  '/server/v2/jvm/heapUsed': modules.common.biteToMb,
  '/server/v2/jvm/edenSpace': modules.common.biteToMb,
  '/server/v2/jvm/survivorSpace': modules.common.biteToMb,
  '/server/v2/jvm/oldGen': modules.common.biteToMb,
  '/server/v2/jvm/codeCache': modules.common.biteToMb,
  '/server/v2/jvm/metaspace': modules.common.biteToMb,
  '/server/v2/jvm/permGen': modules.common.biteToMb
}
