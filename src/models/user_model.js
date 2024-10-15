import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import cron from 'node-cron';

const LoginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    subscriptionStatus: { type: String, default: 'inactive' },
    subscriptionStart: { type: Date, default: null },
    subscriptionEnd: { type: Date, default: null },
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

    async allFindUsers(){
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
        if (user) user.password = null; // Remover a senha
        return user;
    }

    async startSubscription(plan) {
        const durationMap = {
            '24h': 24 * 60 * 60 * 1000,  // 24 hours in milliseconds
            '7d': 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
        };

        const user = await this.findUser();
        if (!user) {
            this.errors.push('Usuário não encontrado');
            return;
        }

        const currentTime = new Date();
        const subscriptionEnd = new Date(currentTime.getTime() + durationMap[plan]);

        user.subscriptionStatus = 'active';
        user.subscriptionStart = currentTime;
        user.subscriptionEnd = subscriptionEnd;
        user.subscriptionPlan = plan;

        await user.save();
        return user;
    }

    async checkSubscription() {
        const user = await this.findUser();
        if (!user) {
            this.errors.push('Usuário não encontrado');
            return;
        }

        const currentTime = new Date();
        if (user.subscriptionEnd && user.subscriptionEnd > currentTime) {
            return 'active';
        } else {
            user.subscriptionStatus = 'inactive';
            user.subscriptionPlan = 'none';
            await user.save();
            return 'inactive';
        }
    }
}

// Cron job para verificar assinaturas
cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    await LoginModel.updateMany(
        { subscriptionEnd: { $lt: today }, subscriptionStatus: 'active' },
        { $set: { subscriptionStatus: 'inactive' } }
    );
    console.log('Status de assinatura atualizado para inativo, se necessário.');
});

export default Login;
