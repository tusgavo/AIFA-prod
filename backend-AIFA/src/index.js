const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const routes = require('./routes');
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/athlete', express.static(path.resolve(__dirname, 'temp', 'athletes')))
app.use('/team', express.static(path.resolve(__dirname, 'temp', 'teams')))
app.use(routes);

app.listen(3000, () => console.log(`Backend running on Port 3000`))
