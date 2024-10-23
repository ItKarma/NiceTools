import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import cron from 'node-cron';

const LoginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    subscriptionStatus: { type: String, default: 'inactive' },
    balance: { type: Number , default: 0.00 }, // Novo campo para saldo
    subscriptionPlan: { type: String, default: 'none' },
});


LoginSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hash = await bcryptjs.hash(this.password, 10);
        this.password = hash;
    }
    next();
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async allFindUsers() {
        const users = await LoginModel.find();
        return users;
    }

    async register() {
        this.valida();
        await this.userExists();

        if (this.errors.length > 0) return;

        this.body.subscriptionStatus = 'inactive';
        this.body.subscriptionPlan = 'none';

        this.user = await LoginModel.create(this.body);
        return this.user;
    }

    async userExists() {
        const user = await LoginModel.findOne({ username: this.body.username });
        if (user) this.errors.push('Usuário já existe!');
    }

    valida() {
        this.cleanUp();
        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 5 e 50 caracteres');
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
            password: this.body.password,
        };
    }

    async findUser() {
        const user = await LoginModel.findOne({ username: this.body.username });
        console.log(user)
        //   if (user) {
        //       user.password = null; // Remover a senha antes de retornar
        //   }
        return user;
    }

    async findUserById(id) {
        const user = await LoginModel.findOne({ _id: id });
       // if (user) user.password = null; // Remover a senha
        return user;
    }

    async startSubscription(plan) {
        const balanceMap = {
            '10': 10,
            '20': 20,
            '30': 30,
            '40': 40,
            '50': 50,
            '80': 80,
            '100': 100,
            '200': 200,
        };

        const user = await this.findUser();
        if (!user) {
            this.errors.push('Usuário não encontrado');
            return;
        }

        // Adiciona o saldo correspondente ao plano
        user.balance += balanceMap[plan];
        user.subscriptionStatus = 'active';
        user.subscriptionPlan = plan;

        await user.save();
        return user;
    }

    async deductBalance(amount,id) {
        const user = await this.findUserById(id);
        if (!user) {
            this.errors.push('Usuário não encontrado');
            return;
        }

        if (user.balance < amount) {
            user.subscriptionStatus = 'inactive';
            await user.save();
            return 'saldo insuficiente';
        }

        user.balance -= amount;  // Deduz o saldo
        if (user.balance <= 0) {
            user.subscriptionStatus = 'inactive';
        }

        await user.save();
        return user;
    }

    async useService(serviceCost) {
        const status = await this.deductBalance(serviceCost);
        if (status === 'saldo insuficiente') {
            this.errors.push('Saldo insuficiente para realizar esta ação');
            return;
        }

        // Lógica do serviço continua aqui
        console.log('Serviço utilizado com sucesso');
    }

}

export default Login;
