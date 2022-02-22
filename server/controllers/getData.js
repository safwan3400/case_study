
const { FormModel } = require('../connections/mongoose')

module.exports = {
    getData: async (req, res) => {
        try {
            if (req.query.id) {

                const data = await FormModel.findById(req.query.id)
                res.status(200).json(data)
                return;
            }
            const data = await FormModel.find()
            res.status(200).json(data)

        } catch (error) {
            res.send(error)
        }
    }

} 