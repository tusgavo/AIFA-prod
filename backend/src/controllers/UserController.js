const connection = require('../database/connection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const key = require('../config/secret.json').crypto

module.exports = {
  login(request, response){
    const { email, senha: password } = request.body;
    console.log(email, password)
    const senha = crypto.createHash('SHA3-512').update(password + key).digest('hex');
    connection('usuarios').where({ email, senha }).select('*').first().then(user => {
      if(user){
        const token = jwt.sign({ id: user.id, perni: user.id_perfil, sub: user.email, iss: 'lidi-server' }, key);
        response.json(token);
      } else response.status(403).json({ msgErr: 'Dados inválidos.' });
    }).catch(err => response.status(500).json({ msgErr: `Essa conta não foi encontrada em nosso sistema!` }));
  },
}
