# NiceTools

È apenas mais uma api que construi, com base no conhecimento de outras apis anteriores, hoje trouxe com um front end auterado por mim, não fiz o front end por completo apenas o back end e a integração, ainda estou melhorando isso  e maias a frente colocarei uma documentação relacionada a api.
este pequeno projeto tem como função e objetivo servi de base para futuros projetos que pretendo construir, claro que irei melhorar isso é apenas um pouco do que sou capaz de fazer com javascript ,Node.js , Express, Mongodb e outras libs que ja sei usar.


# Como usar ou rodar em sua maquina este humilde projeto?
è muito simples mas antes de tudo é nescessario que tenha o Node.js em sua maquina, pelo menos a versão lasted mais recente , ja tem?, otimo! agora é simples se vc tiver o git instalado clone este repositorio assim 

> git clone https://github.com/ItKarma/NiceTools.git

rodou? , deu nenhum erro? ok, proximo passo é entrar na pasta 
> cd NiceTools

apos isso pode instalar as dependencias nescessarias 

> npm i 

( isso instalara todas as dependencias listada em seu package.json )
apos isso crie um arquivo com o nome de 
> .env

pegue sua uri se registrando no site do mongodb atlas , apos isso é so colocar seu uri na variavel DB_URL
se tiver tudo certo seu .env ficara assim 

> DB_URL=mongodb+srv://...

apos isso pode inciar a aplicação com o comando 

> npm run dev

