import loginModel from '../models/user_model.js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import config from '../../config/config.js'
import { activeSessions } from '../helpers/sessionStore.js'; 


function generateToken(params = {}) {
    console.log(params)
    try {
        return jwt.sign(params, config.JWT_SECRET, { expiresIn: '24h' }); 
    } catch (error) {
        console.error('Erro ao gerar o token:', error);
        throw new Error('Token generation failed'); 
    }
}


class authController {

    async singUp(req, res) {
        const { username, password } = req.body;
        let body = { username, password }


        try {
            if (!body.username) return res.status(400).json({ error: 'name is required' });
            if (!body.password) return res.status(400).json({ error: 'password is required' });

            const resSave = await new loginModel(body).register();
            if (!resSave) return res.json({ error: 'User is exist' });
            resSave.password = undefined

            res.json({ resSave, token: generateToken({ id: resSave._id }) });

        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'try again later' })
        }

    }

    async authLogin(req, res) {
        let body = req.body;
        try {
            if (!body.username) return res.status(400).json({ error: 'username is required' });
            if (!body.password) return res.status(400).json({ error: 'password is required' });
    
            const user = await new loginModel(body).findUser();
            console.log('USER TENTANDO EFETUAR LOGIN', body);
    
            if (!user) return res.status(400).json({ error: 'user not found' });
    
            if (!await bcryptjs.compare(body.password, user.password)) {
                return res.status(400).json({ error: 'password invalid' });
            }
    
            user.password = undefined;
    
            const userIp = req.ip;
            const userId = user._id.toString();
 
            if (activeSessions[userId]) {
                if (activeSessions[userId].ip !== userIp) {
                    console.log(`Sessão anterior excluída para o usuário ${userId}`);
                    delete activeSessions[userId];
                }
            }
    
            const token = generateToken({ id: userId }); 
            activeSessions[userId] = { token, ip: userIp };
    
            console.log(token, activeSessions);
            
            res.cookie('ssid', token, { httpOnly: true }); 
    
            return res.json({ user, token });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ erro: error });
        }
    }
    

    async auth(req, res) {
        try {

            res.render('login')

        } catch (error) {
            console.log(error)
            return res.status(400).json({ erro: error })
        }
    }

    async authRegister(req, res) {
        try {
            res.render('register')

        } catch (error) {
            console.log(error)
            return res.status(400).json({ erro: error })
        }
    }
}
export default new authController