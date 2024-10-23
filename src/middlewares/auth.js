import jwt from 'jsonwebtoken';
import secret from '../../config/config.js';
import { activeSessions } from '../helpers/sessionStore.js'; // Ajuste o caminho conforme necessário

const Auth = async (req, res, next) => {
  const token = req.cookies.ssid; // Use o mesmo nome de cookie
//  console.log('Token recebido do cookie:', token); // Adicione esta linha

  if (!token) {
      return res.status(401).render('error', { message: 'Access Denied. Necessário realizar o login' });
  }

 // console.log(userSession)

  try {
      const verified = jwt.verify(token, secret.JWT_SECRET);
    //  console.log(verified)
      req.user = verified;

      // Verifica se a sessão ainda está ativa
      const userId = verified.id; // ID do usuário no token
      const userSession = activeSessions[userId];
     // console.log(userSession)

      if (!userSession || userSession.token !== token) {
          return res.status(401).render('error', { message: 'Sessão inválida ou expirada. Faça login novamente.' });
      }

      // Verifique o IP
      if (userSession.ip !== req.ip) {
          return res.status(401).render('error', { message: 'Sessão inválida. O IP não corresponde à sessão ativa.' });
      }

      next(); 
  } catch (err) {
      console.error('Erro na verificação do token:', err); // Adicione esta linha
      res.status(400).send('Invalid Token');
  }
}


export default Auth;
