const connection = require('../database/connection');

module.exports = {
  list(request, response){
    const { emMes, emAno, vaMes, vaAno, selector, q } = request.query
    let query = `
      SELECT
      a.id AS id,
      a.nome AS nome,
      c.nome AS clube,
      a.rg AS rg,
      a.cpf AS cpf,
      a.nome_pai AS pai,
      a.nome_mae AS mae,
      a.data_nasc AS nasc,
      a.data_emissao_carteirinha AS emissao,
      a.data_validade_carteirinha AS validade
      FROM atletas a
      LEFT JOIN clubes c ON a.id_clube = c.id WHERE a.nome LIKE '%${q}%' `
      let queryFinal = `ORDER BY a.data_validade_carteirinha, a.nome `
      if(selector > 0) query += ` AND c.id = ${selector} `
      if(emMes === 'null' || emAno === 'null') query += ` AND a.data_emissao_carteirinha IS NULL `
      if(vaMes === 'null' || vaAno === 'null') query += ` AND a.data_validade_carteirinha IS NULL `
      if(emMes > 0 || emAno > 0 || vaMes > 0 || vaAno > 0) query += ` GROUP BY a.id HAVING `
      if(emMes > 0) query += ` MONTH(a.data_emissao_carteirinha) = ${emMes} `
      if(emAno > 0) {
        if(emMes > 0) query += ` AND `
        query += ` YEAR(a.data_emissao_carteirinha) = ${emAno} `
      }
      if(vaMes > 0) {
        if(emMes > 0 || emAno > 0) query += ` AND `
        query += ` MONTH(a.data_validade_carteirinha) = ${vaMes} `
      }
      if(vaAno > 0) {
        if(emMes > 0 || emAno > 0 || vaMes > 0 ) query += ` AND `
        query += ` YEAR(a.data_validade_carteirinha) = ${vaAno} `
      }
      connection.raw(`${query} ${queryFinal}`).then(wallets => response.json(wallets[0])).catch(err => console.error(err));
  },
  listWallets(request, response) {
    const { ids } = request.query
    connection({ a: 'atletas' })
    .select({ id: "a.id" },{ nome: "a.nome" },{ rg: "a.rg" },{ cpf: "a.cpf" },{ mae: "a.nome_mae" },{ pai: "a.nome_pai" },{ foto: "a.foto" }, { data_nasc: "a.data_nasc" },{ validade: "a.data_validade_carteirinha" })
    .whereIn('a.id', JSON.parse(ids)).then(wallets => response.json(wallets)).catch(err => console.error(err));
  },
  update(request, response) {
    const { dataEmissao, dataValidade, ids } = request.body
    connection("atletas")
    .whereIn('id', ids)
    .update({ "data_emissao_carteirinha": dataEmissao })
    .update({ "data_validade_carteirinha": dataValidade })
    .then(() => response.json({ status: 200 })).catch(err => console.error(err))
  }
}
