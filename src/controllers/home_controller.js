import Login from "../models/user_model.js";

class homeController {
    async home(req, res) {
        try {
            const userId = req.user.id;
            const user = await new Login().findUserById(userId);
            let users = await new Login().allFindUsers();
            //console.log(user)

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            let userInfo = { status: 'active', balance: user.balance , QtyUser: user.username };
           // console.log(userInfo)

            res.render('index', userInfo);

        } catch (error) {
            console.log(error);
            res.status(400).json({ error: 'Tente novamente mais tarde' });
        }
    }

    async debitando(req, res) {
        try {

            res.render('debitando');

        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'try again later' })
        }

    }


    async contato(req, res) {
        try {

            res.render('contato');

        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'try again later' })
        }

    }

    async about(req, res) {
        try {

            res.render('about');

        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'try again later' })
        }

    }
}
export default new homeController