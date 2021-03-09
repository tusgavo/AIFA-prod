const connection = require('../database/connection');

module.exports = {
  list(request, response) {
      const { q = '' } = request.query;
      connection({ p: 'posicoes'})
      .select('*')
      .whereRaw(`p.nome LIKE '%${q}%'`)
      .orderBy('p.nome')
      .then(positions => response.json(positions)).catch(err => console.error(err));
  },
  listSpecificPosition(request, response){
    const { id } = request.params
    connection('posicoes').where({ id }).first().then(position => response.json(position)).catch(err => console.error(err))
  },
  create(request, response) {
    const position = request.body
    connection({ p: 'posicoes'})
    .select('*')
    .whereRaw(`p.nome LIKE '%${position.nome}%'`).then(value =>{
      value.length >= 1 ?
      response.json({ status: 500, mes: 'Posição já cadastrada' })
      : connection('posicoes').insert(position).then(() => response.json({ status: 200 })).catch(err => console.error(err))
    })
    .catch(err => console.error(err))
  },
  update(request, response) {
    const { id } = request.params
    const position = request.body
    connection('posicoes').where({ id }).update(position).then(() => response.json({ status: 200 })).catch(err => console.error(err))
  },
  delete(request, response) {
    const { id } = request.params
    connection({ a: 'atletas' })
    .select({ id: 'a.id'})
    .where('a.id_posicao', id)
    .then(athlete =>{
      connection({ i: 'inscricoes' })
      .select({ id: 'i.id'})
      .where('i.id_posicao', id)
      .then(registration =>
        athlete.length >= 1 || registration.length >= 1 ?
        response.json({ status: 500, mes: 'Já existe Atleta inscrito para jogar nesta posição' }) :
        connection('posicoes').where({ id }).delete().then(() => response.json({ status: 200 })).catch(err => console.error(err))
      )
      .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
  },
}
