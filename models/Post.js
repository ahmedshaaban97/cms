const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema = new Schema({

    user : {
        type : Schema.Types.ObjectId,
        ref : 'users'
    },


    category : {
        type : Schema.Types.ObjectId,
        ref :'categories'
    },

    title : {
        type : String,
        required : true
    },

    status : {
        type : String,
        default : 'public'
    },

    allowComments : {
        type : Boolean,
        required : true
    },

    description : {
        type : String,
        required : true
    },
    hasPhoto : {
        type : Boolean,
        required : true
    },


    file : {
        type : String

    },

    date : {
        type : Date,
        default : Date.now()
    },

    comments : [{
            type : Schema.Types.ObjectId,
            ref :'comments'
    }]

});

module.exports = mongoose.model('posts',PostSchema);