class homeController {
    async home(req, res) {
        try {

            res.render('index');

        } catch (error) {
            console.log(error)
            res.status(400).json({ error: 'try again later' })
        }

    }
}
export default new homeController