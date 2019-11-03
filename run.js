const client = require('./client.js')

const newNote = {
  title: 'New Note',
  content: 'New Note Content',
}

const unary = () => {
  client.insert(newNote, (err, note) => {
    if (err) return console.error(err)
    console.log('added new note', note)
    client.list({}, (err, notes) => {
      if (err) return console.error(err)
      console.log(notes)
    })
  })
}

const serverStream = () => {
  const call = client.listStream()
  call.on('data', console.log)
  call.on('error', console.error)
  call.on('end', process.exit)
}

const clientStream = () => {
  const call = client.insertStream((err, notes) => {
    if (err) return console.error(err)
    console.log(notes)
  })
  call.write(newNote)
  call.write(newNote)
  call.write(newNote)
  call.end()
}

// only one side needs to end
const bidirectionalStream = () => {
  const call = client.passAround()
  call.write({ title: 'hey', content: '' })
  call.on('data', data => {
    console.log('client', data)
    call.write({ ...data, content: data.content + 'a' })
  })
  call.on('error', console.error)
  call.on('end', () => {
    client.list({}, (err, notes) => {
      if (err) return console.error(err)
      console.log(notes)
      call.end()
    })
  })
}

bidirectionalStream()
