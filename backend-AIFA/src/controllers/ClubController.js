const connection = require("../database/connection");

module.exports = {
  list(request, response) {
    const { q = "" } = request.query;
    connection({ c: "clubes" })
      .select("*")
      .whereRaw(`c.nome LIKE '%${q}%'`)
      .orderBy("c.nome")
      .then((clubs) => response.json(clubs))
      .catch((err) => console.error(err));
  },
};
