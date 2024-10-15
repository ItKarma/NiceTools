function verificaAlgoritmoLuhn(numeroCartao) {
    const digitos = numeroCartao.split('').reverse();
    let soma = 0;

    digitos.forEach((digito, i) => {
        let num = parseInt(digito);
        if (i % 2 === 1) {
            num *= 2;
            if (num > 9) num -= 9;
        }
        soma += num;
    });

    return soma % 10 === 0;
}

function verificaTipoCartao(numeroCartao) {
    if (!verificaAlgoritmoLuhn(numeroCartao)) {
        return "Número de cartão inválido";
    }

    if (numeroCartao.startsWith('4')) {
        return "Visa";
    } else if (numeroCartao.startsWith('51') || 
               numeroCartao.startsWith('52') || 
               numeroCartao.startsWith('53') || 
               numeroCartao.startsWith('54') || 
               numeroCartao.startsWith('55') || 
               (parseInt(numeroCartao.substring(0, 4)) >= 2221 && 
                parseInt(numeroCartao.substring(0, 4)) <= 2720)) {
        return "MasterCard";
    } else {
        return "Desconhecido";
    }
}

export default verificaTipoCartao