const connection = require('../database/connection');

module.exports = {
    list(request, response){
      const { q = '' } = request.query;
      connection({ c: 'categorias'})
      .select('*')
      .whereRaw(`c.nome LIKE '%${q}%' OR c.descricao LIKE '%${q}%'`)
      .orderBy('c.nome')
      .then(categories => response.json(categories)).catch(err => console.error(err));
    },
}
