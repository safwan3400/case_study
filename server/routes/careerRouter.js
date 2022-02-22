
const express = require('express')
const router = express.Router()

const { postData, deleteData, updateData } = require('../controllers/setData')
const { getData } = require('../controllers/getData')

router.route('/submit').post(postData).put(updateData)

router.route('/form-data').get(getData).delete(deleteData)


module.exports = router;