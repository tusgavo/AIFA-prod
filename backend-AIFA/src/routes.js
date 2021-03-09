const express = require('express');
const multer = require('multer');
const { athletes, teams } = require('./config/multerConfig');
const authorization = require('./config/auth')

const AthleteController = require('./controllers/AthleteController');
const CategoryController = require('./controllers/CategoryController');
const ClubController = require('./controllers/ClubController');
const PositionController = require('./controllers/PositionController');
const TeamController = require('./controllers/TeamController');
const UserController = require('./controllers/UserController');
const WalletController = require('./controllers/WalletController');

const routes = express.Router();

// Login
routes.post('/login', UserController.login);
// Atletas
routes.get('/getAtletas', authorization, AthleteController.list)
routes.get('/getAtleta/:id', authorization, AthleteController.listSpecificAthlete)
routes.post('/cadastrarAtleta', authorization, multer(athletes).array('fotos'), AthleteController.create)
routes.put('/updateAtleta/:id', authorization, multer(athletes).array('fotos'), AthleteController.update)
routes.delete('/deletarAtleta/:id', authorization, AthleteController.delete)
// Categorias
routes.get("/getCategorias", authorization, CategoryController.list)
// Carteirinha
routes.get('/getCarteirinhas', authorization, WalletController.list)
routes.get('/getCartoes', authorization, WalletController.listWallets)
routes.put('/updateDataEmissao', authorization, WalletController.update)
// Clubes
routes.get('/getClubes', authorization, ClubController.list)
// Equipes
routes.get("/getEquipes", authorization, TeamController.list)
routes.get('/getEquipe/:id', authorization, TeamController.listSpecificTeam)
routes.post('/cadastrarEquipe', authorization, multer(teams).array('fotos'), TeamController.create)
routes.put('/updateEquipe/:id', authorization, multer(teams).array('fotos'), TeamController.update)
routes.delete('/deletarEquipe/:id', authorization, TeamController.delete)
// Posição
routes.get("/getPosicoes", authorization, PositionController.list)
routes.get('/getPosicao/:id', authorization, PositionController.listSpecificPosition)
routes.post('/cadastrarPosicao', authorization, PositionController.create)
routes.put('/updatePosicao/:id', authorization, PositionController.update)
routes.delete('/deletarPosicao/:id', authorization, PositionController.delete)

module.exports = routes;
