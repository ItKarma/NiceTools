import jwt from 'jsonwebtoken'
import secret from '../../config/config.js'


const Auth = async (req, res, next) => {
  const token = req.cookies.ssid;

  if (!token) {
    return res.status(401).render('error', { message: 'Access Denied. Nescessario realizar o login' });
  }

  try {
    const verified = jwt.verify(token, secret.JWT_SECRET); 
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }

  next()
}

export default Auth