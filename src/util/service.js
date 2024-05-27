// 
exports.KEY_TOKEN = "KHSDAB@#$12345r23";
exports.KEY_REFRESH = "@#4523FKSREN^%#@#";
const multer = require("multer");

exports.isEmptyOrNull = (value) => {
    if (value === null || value === undefined || value === "") {
        return true;
    }
    return false;
};

exports.invoiceNumber = (number) => {
    var str = "" + (number+1);
    var pad = "INV0000";
    var ivoice = pad.substring(0, pad.length - str.length) + str;
    return "INV" + ivoice;
}


exports.upload = multer ({
    storage : multer.diskStorage({
        destination : function (req,file,callback){
            callback(null, "C:/xampp/htdocs/project/images-server-api/")
        },
        filename : function (req, file, cb){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    }),
    limits : {
        fileSize : (1024 * 1024) * 5
    },
    fileFilter : (req, file, cb) => {
        console.log(file)
        if(file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg"){
            cb(null, false)
        }else{
            cb(null, true)
        }
    }
})
