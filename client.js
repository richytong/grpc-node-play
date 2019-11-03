const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = './notes.proto'

const loadProto = x => grpc.loadPackageDefinition(protoLoader.loadSync(x))

const proto = loadProto(PROTO_PATH)

const host = 'localhost'
const port = '50051'

const client = new proto.NoteService(
  `${host}:${port}`,
  grpc.credentials.createInsecure(),
)

module.exports = client
