const db = require("../util/db");

const getAll = async (req,res) =>{
    const sql = "SELECT * FROM payment_method ORDER BY payment_method_id DESC";
    const data = await db.query(sql);
    res.json({
        data : data
    })
}

const create = async (req,res) =>{
    const {name_pm, code} = req.body;
    var filename = null
    if(req.file){ // true when have upload file from client
        filename = req.file.filename // get filename for store to database
    }
    const sql = "INSERT INTO payment_method(name_pm, code, image) VALUES (?,?,?)";
    const param = [name_pm, code, filename];
    const data = await db.query(sql,param);
    res.json({
        message:"Product added successfully",
        data : data,
    })
}

const remove = async (req,res) =>{
    const {payment_method_id} = req.body;
    const sql = "DELETE FROM payment_method WHERE payment_method_id = ?";
    const param = [payment_method_id];
    const data = await db.query(sql,param);
    res.json({
        message:"Product removed successfully",
        data : data
    })
}

module.exports = {
    getAll,
    create,
    remove
}
