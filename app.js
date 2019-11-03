const makeProtoApp = require('make-proto-app')
const uuidv4 = require('uuid/v4')

const notes = [
  { id: '1', title: 'Note 1', content: 'Content 1' },
  { id: '2', title: 'Note 2', content: 'Content 2' },
]

module.exports = makeProtoApp({
  host: 'localhost',
  port: 3000,
  protopath: 'notes.proto',
  services: {
    NoteService: {
      list: (_, cb) => { cb(null, { notes }) },
      listStream: call => {
        for (const note of notes) call.write(note)
        call.end()
      },
      insert: (call, cb) => {
        const data = call.request
        const note = { ...data, id: uuidv4() }
        notes.push(note)
        cb(null, note)
      },
      insertStream: (call, cb) => {
        const insertedNotes = []
        call.on('data', data => {
          const note = { ...data, id: uuidv4() }
          notes.push(note)
          insertedNotes.push(note)
        })
        call.on('error', console.error)
        call.on('end', () => cb(null, { notes: insertedNotes }))
      },
      passAround: call => {
        call.on('data', data => {
          console.log('server', data)
          if (data.content.length >= 10) {
            const note = { ...data, id: uuidv4() }
            notes.push(note)
            call.write(note)
            console.log('server ending')
            call.end()
          } else {
            call.write({ ...data, content: data.content + 'a' })
          }
        })
        call.on('error', console.error)
      }
    },
  },
})
