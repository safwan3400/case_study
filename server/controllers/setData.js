

const { FormModel } = require('../connections/mongoose')
const fs = require('fs')
const path = require('path')

module.exports = {
    postData: async (req, res) => {
        const body = req.body

        if (
            !body.name.length
            || !body.email.length
            || body.mobileCode.toString().length > 5
            || body.mobile.toString().length !== 10
            || !body.userJobType.length
            || !body.dob.length
            || !body.loc.length
            || !body.imgBase64.length
        ) {
            res.status(400).send({ 'error': 'Invalid data' })
            return
        }

        const data = await FormModel.findOne({
            $or: [
                { email: body.email },
                { mobile: parseInt(body.mobile) }
            ]
        })
        if (data) {

            res.status(400).json({ msg: 'User already exist' })
            return
        }

        try {

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            let imgName = uniqueSuffix + '.png';
            body.pic = imgName

            const base64Data = body.imgBase64.replace(/^data:image\/png;base64,/, "");
            delete body.imgBase64;


            fs.writeFile(path.join(__dirname, `../public/images/${body.pic}`), base64Data, 'base64', function (err) {
                console.log(err);
            });

            const formData = new FormModel(body)
            formData.save()

        } catch (error) {
            res.status(501).json({ status: 501, msg: 'failed to submit form' })
            return;
        }
        res.status(200).json({ status: 200, msg: "form submitted successfully" })
    },
    updateData: async (req, res) => {
        const body = req.body

        if (
            !body.name.length
            || !body.email.length
            || body.mobileCode.toString().length > 5
            || body.mobile.toString().length !== 10
            || !body.userJobType.length
            || !body.dob.length
            || !body.loc.length
        ) {
            res.status(400).send({ 'error': 'Invalid data' })
            return
        }

        try {
            const response = await FormModel.findById(req.query.id)
            if (!response) {
                res.status(400).json({ status: 400, msg: 'User not found' })
                return

            }
            if (body.imgBase64) {
                const base64Data = body.imgBase64.replace(/^data:image\/png;base64,/, "");
                delete body.imgBase64;

                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                let imgName = uniqueSuffix + '.png';
                body.pic = imgName

                fs.writeFile(path.join(__dirname, `../public/images/${body.pic}`), base64Data, 'base64', function (err) {
                    console.log(err);
                });
                fs.unlinkSync(path.join(__dirname, `../public/images/${response.pic}`));
            }
            const updateRes = await FormModel.updateOne({ _id: response._id }, body)
            if (!updateRes) {
                res.status(501).json({ err: 'Err' })
                return
            }
            res.status(200).json({ msg: 'Form updated successfully' })
        } catch (error) {
            console.log(error);
        }

    },
    deleteData: async (req, res) => {
        try {
            const response = await FormModel.findOneAndDelete({ _id: req.query.id })
            if (response) {
                fs.unlinkSync(path.join(__dirname, `../public/images/${response.pic}`));
                res.json({ msg: "item deleted successfully" })
                return;
            }

        } catch (error) {
            res.json(error)
            return;
        }

    }

}