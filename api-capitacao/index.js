// config inicial
const express = require('express');

require('dotenv').config();

const mongoose = require('mongoose');

const app = express();

const PORT = 3003;


//forma de ler JSON / middlewares


app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

// rotas da API

const companyRoutes = require('./routes/companyRoutes');

app.use('/company', companyRoutes) //aqui eu faço com que tudo que venha da rota /company caia no file companyRoutes(que eh onde estara os metodos http da rota)

app.get('/',(req, res) => {
    res.json({message: 'Hello Express'})
})

//entregar uma porta


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@apicluster.gdrrb.mongodb.net/?retryWrites=true&w=majority`
)
.then(() => {
    console.log('Successfully connected to MongoDB')
    app.listen(PORT)                                    //só estou ouvindo a porta caso a API consiga conectar ao banco primeiro
})
.catch((err) => console.log(err))



