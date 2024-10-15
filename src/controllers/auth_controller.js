import loginModel from '../models/user_model.js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import config from '../../config/config.js'


function gerenateToken(params = {}) {
    return jwt.sign(params, config.JWT_SECRET, { expiresIn: 84600 })
}


class authController {
    
    async singUp(req, res) {
        const { username, password } = req.body;
        let body = { username, password}


        try {
            if (!body.username) return res.status(400).json({ error: 'name is required' });
            if (!body.password) return res.status(400).json({ error: 'password is required' });

            const resSave = await new loginModel(body).register();
            if (!resSave) return res.json({ error: 'User is exist' });
            resSave.password = undefined

            res.json({ resSave, token: gerenateToken({ id: resSave._id }) })
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'try again later' })
        }

    }

    async authLogin(req, res) {
        let body = req.body
        console.log(body)
        try {
            if (!body.username) return res.status(400).json({ error: 'username is required' })
            if (!body.password) return res.status(400).json({ error: 'password is required' })

            const user = await new loginModel(body).findUser();
            console.log('USER TENTANDO EFETUAR LOGIN', body)

            if (!user) return res.status(400).json({ error: 'user not found' })

            if(!await bcryptjs.compare(body.password, user.password)) {
                return res.status(400).json({ error: 'password invalid' })
            }

            user.password = undefined

            return res.json({ user, token: gerenateToken({ id: user._id }) })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ erro: error })
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

    async authRegister (req,res){
        try {
            res.render('register')

        } catch (error) {
            console.log(error)
            return res.status(400).json({ erro: error })
        }
    }
}
export default new authController