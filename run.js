const client = require('./client.js')

const newNote = {
  title: 'New Note',
  content: 'New Note Content',
}

client.insert(newNote, (err, note) => {
  if (err) return console.error(err)
  console.log('added new note', note)
  client.list({}, (err, notes) => {
    if (err) return console.error(err)
    console.log(notes)
  })
})
