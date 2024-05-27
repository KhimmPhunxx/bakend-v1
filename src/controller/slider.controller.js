// 
const db = require("../util/db");

const getAll = async (req,res) =>{  
    const sql = "SELECT * FROM slider";
    const data = await db.query(sql);
    res.json({
        data : data
    })
}

const create = async (req,res) =>{
    const {slider_name} = req.body;
    var filename = null
    if(req.file){ // true when have upload file from client
        filename = req.file.filename // get filename for store to database
    }
    const sql = "INSERT INTO slider(slider_name, slider_image) VALUES (?,?)";
    const param = [slider_name, filename];
    const data = await db.query(sql,param);
    res.json({
        message:"Product added successfully",
        data : data,
    })
}

const remove = async (req,res) =>{
    const {slider_id} = req.body;
    const sql = "DELETE FROM slider WHERE slider_id = ?";
    const param = [slider_id];
    const data = await db.query(sql,param);
    res.json({
        message:"Product removed successfully",
        data : data
    })
}

module.exports = {
    getAll,
    create,
    remove,
}