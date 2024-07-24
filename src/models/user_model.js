import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const LoginSchemma = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },

})

LoginSchemma.pre('save', async function (next) {
    const hash = bcryptjs.hash(this.password, 10)
    this.password = hash

    next()
})


const LoginModel = mongoose.model('Login', LoginSchemma);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;

    }

    async register() {
        this.valida();
        await this.userExists();

        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync(5);
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);
      //  console.log(this.user)
        return this.user
    }

    async userExists() {
        console.log(this.body.username)
        const user = await LoginModel.findOne({ username: this.body.username });
       // console.log(user)
        if (user) this.errors.push('Usuario ja Existe!');
    }

    valida() {
        this.cleanUp();


        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 5 e 50 caracteres')
        }

    }

    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            username: this.body.username,
            password: this.body.password
        }
        console.log(this.body)


    }

    async findUser() {

        console.log(this.body.username)
        const user = await LoginModel.findOne({ username: this.body.username });
        return user

    }
}

export default Login