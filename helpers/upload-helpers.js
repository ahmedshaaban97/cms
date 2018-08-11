const path = require('path');

module.exports = {

    uploadedDir : path.join(__dirname , '../public/uploads/'),

    isEmpty : function (obj) {
        for (let key in obj){
            if (obj.hasOwnProperty(key)){
                return false;
            }
        }

        return true;
    },

    isFull : function (obj) {
        for (let key in obj){
            if (obj.hasOwnProperty(key)){
                return true;
            }
        }

        return false;
    }
};