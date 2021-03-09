const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

module.exports = {
  athletes: {
    dest: path.join(__dirname, '..', 'temp', 'athletes'),
    storage: multer.diskStorage({
      destination: path.join(__dirname, '..', 'temp', 'athletes'),
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
          if(err) cb(err)
          const fileName = `${hash.toString('hex')}-${file.originalname}`
          cb(null, fileName)
        })
      }
    }),
    fileFilter: (req, file, cb) => {
      const pernition = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif'
      ]

      if(pernition.includes(file.mimetype)){
        cb(null, true)
      } else {
        cb(new Error('Invalid file type.'))
      }
    }
  },
  teams: {
    dest: path.join(__dirname, '..', 'temp', 'teams'),
    storage: multer.diskStorage({
      destination: path.join(__dirname, '..', 'temp', 'teams'),
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
          if(err) cb(err)
          const fileName = `${hash.toString('hex')}-${file.originalname}`
          cb(null, fileName)
        })
      }
    }),
    fileFilter: (req, file, cb) => {
      const pernition = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif'
      ]

      if(pernition.includes(file.mimetype)){
        cb(null, true)
      } else {
        cb(new Error('Invalid file type.'))
      }
    }
  }
}
