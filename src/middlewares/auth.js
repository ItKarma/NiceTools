import jwt from 'jsonwebtoken';
import secret from '../../config/config.js';
import { activeSessions } from '../helpers/sessionStore.js'; 

const normalizeIp = (ip) => {
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }
  return ip;
};

const Auth = async (req, res, next) => {
  const token = req.cookies.ssid;

  if (!token) {
    return res.status(401).render('error', { message: 'Access Denied. Necessário realizar o login' });
  }

  try {
    const verified = jwt.verify(token, secret.JWT_SECRET);
    req.user = verified;

    const userId = verified.id; 
    const userSession = activeSessions[userId];
    console.log('Sessão ativa encontrada:', userSession);

    if (!userSession || userSession.token !== token) {
      return res.status(401).render('error', { message: 'Sessão inválida ou expirada. Faça login novamente.' });
    }

    const userIp = normalizeIp(req.ip);
    const sessionIp = normalizeIp(userSession.ip);
    if (sessionIp !== userIp) {
      return res.status(401).render('error', { message: 'Sessão inválida. O IP não corresponde à sessão ativa.' });
    }

    res.cookie('ssid', token, { httpOnly: true });

    next(); 
  } catch (err) {
    console.error('Erro na verificação do token:', err.message); 
    res.status(400).json({ message: 'Token inválido ou expirado', error: err.message });
  }
};

export default Auth;
