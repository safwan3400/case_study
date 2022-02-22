

const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb://localhost/tasks', () => {
        console.log('database connected, DB_NAME: tasks');
    });
} catch (error) {
    console.log(error);
}

const Schema = mongoose.Schema;


const FormSchema = new Schema({
    name: String,
    email: String,
    loc: String,
    mobileCode: Number,
    mobile: Number,
    dob: Date,
    userJobType: String,
    pref_loc:String,
    pic: String
});


FormSchema.index({ email: 1 });

const FormModel = mongoose.model("FormData", FormSchema);

module.exports = { FormModel }