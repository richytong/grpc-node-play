const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const uuidv4 = require('uuid/v4')

const PROTO_PATH = 'notes.proto'

const loadProto = x => grpc.loadPackageDefinition(protoLoader.loadSync(x))

const proto = loadProto(PROTO_PATH)

const notes = [
  { id: '1', title: 'Note 1', content: 'Content 1' },
  { id: '2', title: 'Note 2', content: 'Content 2' },
]

const server = new grpc.Server()

server.addService(proto.NoteService.service, {
  list: (_, cb) => { cb(null, { notes }) },
  insert: (call, cb) => {
    const noteBody = call.request
    const note = { ...noteBody, id: uuidv4() }
    notes.push(note)
    cb(null, note)
  },
})

const protocol = 'http'
const host = 'localhost'
const port = '50051'

server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure())
console.log(`Server running at ${protocol}://${host}:${port}`)
server.start()
