const jwt = require('jsonwebtoken')
const key = require('./secret.json').crypto

module.exports = (req, res, next) => {
  const token = extractToken(req)
  !token ? res.status(401).json({ mensagem: 'Você precisa se autenticar.' })
  : jwt.verify(token, key, (err, decoded) => {
      if (decoded) {
        res.usuario = decoded
        next()
      } else res.status(403).json({ mensagem: 'Não autorizado' })
    })
}

function extractToken(req) {
  let token = undefined
  if(req.headers && req.headers.authorization){
    const parts = req.headers.authorization.split(' ')
    if(parts.length === 2 && parts[0] === 'Bearer') token = parts[1]
  }
  return token
}
