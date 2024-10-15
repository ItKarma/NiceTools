import Login from "../models/user_model.js";
import gates_controllers from "./gates_controllers.js";

class homeController {
    async home(req, res) {
        try {
            const userId = req.user.id; 
            const user = await new Login().findUserById(userId);
            let users = await new Login().allFindUsers();
         //   console.log(users.length)
    
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
    
            const timeLeft = await gates_controllers.checkSubscriptionTime(user);
            let userInfo = { status: 'active', timeLeft, QtyUser: users.length };
    
            if (timeLeft === 0) {
                userInfo.status = 'inactive';
            }
    
          //  console.log(userInfo);
            res.render('index', userInfo); 
    
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: 'Tente novamente mais tarde' });
        }
    }
    

    async allbins(req, res) {
        try {

            res.render('allbins');

        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'try again later' })
        }

    }

    async allbins2(req, res) {
        try {

            res.render('allbins2');

        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'try again later' })
        }

    }
}
export default new homeController