import jwt from 'jsonwebtoken';
import secret from '../../config/config.js';
import { activeSessions } from '../helpers/sessionStore.js'; // Ajuste o caminho conforme necessário

// Função para normalizar o IP, convertendo IPv6 loopback para IPv4 loopback
const normalizeIp = (ip) => {
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }
  return ip;
};

const Auth = async (req, res, next) => {
  const token = req.cookies.ssid; // Use o mesmo nome de cookie
 // console.log('Token recebido do cookie:', token); // Log para verificar o token

  if (!token) {
    return res.status(401).render('error', { message: 'Access Denied. Necessário realizar o login' });
  }

  try {
    const verified = jwt.verify(token, secret.JWT_SECRET);
   // console.log('Usuário verificado pelo token:', verified);
    req.user = verified;

    // Verifica se a sessão ainda está ativa
    const userId = verified.id; // ID do usuário no token
    const userSession = activeSessions[userId];
    console.log('Sessão ativa encontrada:', userSession);

    if (!userSession || userSession.token !== token) {
      return res.status(401).render('error', { message: 'Sessão inválida ou expirada. Faça login novamente.' });
    }

    // Verifique o IP e normalize ambos os IPs
    const userIp = normalizeIp(req.ip);
    const sessionIp = normalizeIp(userSession.ip);
  //[[]]  console.log('IP do usuário:', userIp);
    if (sessionIp !== userIp) {
      return res.status(401).render('error', { message: 'Sessão inválida. O IP não corresponde à sessão ativa.' });
    }

    // Se você quiser renovar o cookie, pode deixar essa linha, caso contrário, remova-a
    res.cookie('ssid', token, { httpOnly: true });

    next(); 
  } catch (err) {
    console.error('Erro na verificação do token:', err.message); 
    res.status(400).json({ message: 'Token inválido ou expirado', error: err.message });
  }
};

export default Auth;
