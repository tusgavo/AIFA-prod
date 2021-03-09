const connection = require('../database/connection');
const { url } = require('../config/secret.json')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const moment = require('moment');

module.exports = {
  list(request, response){
    const { q = '' } = request.query
    connection('equipes')
    .select('*')
    .whereRaw(` nome LIKE '%${q}%' OR empresa LIKE '%${q}%' `)
    .then(teams => response.json(teams)).catch(err => console.log(err));
  },
  listSpecificTeam(request, response){
    const { id } = request.params
    connection('equipes').where({ id }).first().then(teams => response.json(teams)).catch(err => console.error(err))
  },
  create(request, response){
    const team = request.body
    console.log()
    team.url_logotipo = `${url}/team/${request.files[0].filename}`
    team.createdAt = moment().format("YYYY-MM-DD hh:mm");
    team.updatedAt = moment().format("YYYY-MM-DD hh:mm");
    connection('equipes').insert(team).then(() => response.json({ status: 200 })).catch(err => console.error(err))
  },
  update(request, response){
    const { id } = request.params
    const team = request.body
    team.updatedAt = moment().format("YYYY-MM-DD hh:mm");
    request.files.length === 1 ? connection('equipes').select('url_logotipo').where({ id }).first().then(({ url_logotipo }) => {
      team.url_logotipo = `${url}/team/${request.files[0].filename}`
      let caminho = url_logotipo.split('/')[4]
      promisify(fs.unlink)(path.resolve(__dirname, '..', 'temp', 'teams', caminho))
      connection('equipes').where({ id }).update(team).then(() => response.json({ status: 200 })).catch(err => console.error(err))
    }).catch(err => console.error(err)) : connection('equipes').where({ id }).update(team).then(() => response.json({ status: 200 })).catch(err => console.error(err))
  },
 delete(request, response){
    const { id } = request.params
    connection('equipes').select('url_logotipo').where({ id }).first()
    .then(({ url_logotipo }) => {
      let caminho = url_logotipo.split('/')[4]
      promisify(fs.unlink)(path.resolve(__dirname, '..', 'temp', 'teams', caminho))
      connection('equipes').where({ id }).delete().then(() => response.json({ status: 200 })).catch(err => console.error(err))
    })
    .catch(err => console.error(err))
  },
}
