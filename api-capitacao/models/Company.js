const mongoose = require('mongoose');

const Company = mongoose.model('Company', {
    cnpj: String,
    razao_social: String,
    nome_fantasia: String,
    cnae_fiscal: String,
    lodragouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cep: String,
    sigla_uf: String,
    ddd_telefone_1: String,
    ddd_telefone_: String
})

module.exports = Company