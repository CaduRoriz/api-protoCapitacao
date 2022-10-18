const router = require('express').Router();

const Company = require('../models/Company'); //importando classe do tipo mongoose

const fs = require('fs');

//create / criação de dados

router.post('/criaLoja', async (req,res) => { // soh precisei colocar o caminho / e nao /company pq aqui ja vai cair apenas na rota/company
    const {cnpj, razao_social, nome_fantasia, cnae_fiscal, logradouro,
    numero, complemento, bairro, cep, sigla_uf, ddd_telefone_1 } = req.body
   
    const company = {
        cnpj,
        razao_social,
        nome_fantasia,
        cnae_fiscal,
        lodragouro,
        numero,
        complemento,
        bairro,
        cep,
        sigla_uf,
        ddd_telefone_1,
    }

    if(!cnpj||!nome||!uf||!cnae||!cep||!telefone){
        res.status(422).json({error: 'Todos os campos devem ser preenchidos'})
        return
    }

    if( await Company.find({cnpj}) != 0){
        res.status(500).json({message: 'Já há uma loja cadastrada com esse cnpj'})
        return
    }
    
    try {
        await Company.create(company)
        res.status(201).json({message: 'Empresa inserida no sistema com sucesso!'})
    } catch (error) {
        res.status(500).json({error: error}) //to atribuindo qualquer erro para erro de servidor
    }

})


router.get('/all', async (req,res) => { //acho que nem preciso desse metodo aqui não
    var bairros = []
    
    try {
        const companies = await Company.find()
        
        companies.forEach(el => {
            bairros.push(el.bairro)
            
        })

        
        bairros = [...new Set(bairros)]

        res.status(200).json(companies)
    } catch (error){
        res.status(500).json({error: error})
    }
})


// router.get('/encheData', async (req, res) => {
//     try{
//         const data = fs.readFileSync('./lojas.json', 'utf-8');
//         const cidades = ["Gama","Brasilia","Ceilandia", "Planaltina","Sobradinho",
//         "Recanto Das Emas", "Guara", "Taguatinga", "Samambaia", "Nucleo Bandeirante"]
//         const lojas = JSON.parse(data);

//         lojas.forEach(el => {
//             if(cidades.includes(el.bairro)){
//                 Company.create(el)
//             }
//         })

//         res.status(200).json("Vamos checar se deu bom")

//     }catch (error){
//         res.status(500).json({error: error})
//     }
// })

// Read - leitura de dados filtrados


router.get('/', async (req, res) => { //aqui a rota para buscar por cnae+bairro
    //forma de fazer a requisão => /company/?cnae=xxxxx&bairro=Xxxxx | aqui tem a questao da primeira letra ser minúscula
    const bairro = req.query.bairro;
    const cnae = req.query.cnae;
    const limite = req.query.limite;

    
    try{
        const companies = await Company.find({
            cnae_fiscal: cnae,
            bairro
        }).limit(limite)

        if(companies == 0){
            res.status(422).json({message: 'Nenhum resultado encontrado com essas chaves'});
        }
       
        if(!companies){
            res.status(422).json({message: 'Não há empresas com esse cnae nesse bairro'});
            return
        }
        res.status(200).json(companies)
    }catch(error) {
        res.status(500).json({error:error})
    }
})

// Update - Atualização de um ou alguns dados especifico de um cadastro, recuperado através do id(pode ser o cnpj por ser unica)

router.patch('/', async (req,res) => { //acho que não vale a pena colocar esse pq nao vou restringir acesso
    const id = req.query.cnpj
    
    const {cnpj, razao_social, nome_fantasia, uf, cnae, cep, telefone} = req.body
   
    const company = {
        cnpj,
        nome,
        uf,
        cnae,
        cep, 
        telefone
    }
    
    try{
        const updateCompany = await Company.updateOne({cnpj}, company)

        if(updateCompany.matchedCount === 0){
            res.status(422).json({message: 'A empresa não foi encontrada'})
            return
        }

        res.status(200).json(company)
    } catch(error) {
        res.status(500).json({error:error})
    }
})

// Delete - deletar dados

router.delete('/', async(req,res)=> { //usar o query tbm... ainda que nao vou restringir o acesso vou deixar deletar, ngm vai querer deletar o banco todo kkkk
    const cnpj = req.query.cnpj

    const company = await Company.findOne({cnpj})
       
        if(!company){
            res.status(422).json({message: 'Empresa não encontrada no banco de dados'})
            return
        }

        try {
            await Company.deleteOne({_id: id})

            res.status(200).json({message: 'Empresa removida com sucesso!'})
        } catch {
            res.status(500).json({error:error})
        }

})

module.exports = router;