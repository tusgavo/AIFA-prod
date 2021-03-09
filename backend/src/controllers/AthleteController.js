const connection = require("../database/connection");
const { url } = require("../config/secret.json");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const moment = require("moment");

module.exports = {
  list(request, response) {
    const { q = "" } = request.query;
    connection({ a: "atletas" })
      .leftJoin({ c: "categorias" }, { "a.id_categoria": "c.id" })
      .select({
        id: "a.id",
        nome: "a.nome",
        categoria: "c.nome",
        cpf: "a.cpf",
        email: "a.email",
        celular: "a.celular",
      })
      .whereRaw(`a.nome LIKE '%${q}%' OR a.cpf LIKE '%${q}%'`)
      .orderBy("a.nome")
      .then((athletes) => response.json(athletes))
      .catch((err) => console.error(err));
  },
  listSpecificAthlete(request, response) {
    const { id } = request.params;
    connection("atletas")
      .where({ id })
      .first()
      .then((atleta) => response.json(atleta))
      .catch((err) => console.error(err));
  },
  create(request, response) {
    const athlete = request.body;
    athlete.id_posicao = 1;
    athlete.id_equipe = 1;
    athlete.foto = `${url}/athlete/${request.files[0].filename}`;
    athlete.createdAt = moment().format("YYYY-MM-DD hh:mm");
    athlete.updatedAt = moment().format("YYYY-MM-DD hh:mm");
    connection("atletas")
      .insert(athlete)
      .then(() => response.json({ status: 200 }))
      .catch((err) => console.error(err));
  },
  update(request, response) {
    const { id } = request.params;
    const athlete = request.body;
    athlete.id_posicao = 1;
    athlete.id_equipe = 1;
    athlete.updatedAt = moment().format("YYYY-MM-DD hh:mm");
    request.files.length === 1
      ? connection("atletas")
          .select("foto")
          .where({ id })
          .first()
          .then(({ foto }) => {
            athlete.foto = `${url}/athlete/${request.files[0].filename}`;
            let caminho = foto.split("/")[4];
            promisify(fs.unlink)(
              path.resolve(__dirname, "..", "temp", "athletes", caminho)
            );
            connection("atletas")
              .where({ id })
              .update(athlete)
              .then(() => response.json({ status: 200 }))
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err))
      : connection("atletas")
          .where({ id })
          .update(athlete)
          .then(() => response.json({ status: 200 }))
          .catch((err) => console.error(err));
  },
  delete(request, response) {
    const { id } = request.params;
    connection("atletas")
      .select("foto")
      .where({ id })
      .first()
      .then(({ foto }) => {
        let caminho = foto.split("/")[4];
        promisify(fs.unlink)(
          path.resolve(__dirname, "..", "temp", "athletes", caminho)
        );
        connection("atletas")
          .where({ id })
          .delete()
          .then(() => response.json({ status: 200 }))
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  },
};
