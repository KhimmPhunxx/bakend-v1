const { isEmptyOrNull } = require("../util/service");
const db = require("../util/db");

const getAll = async (req,res) =>{
    const sql = "SELECT * FROM `laptop_category`";
    const data = await db.query(sql);
    res.json({
        data_cate : data
    })
}

const create = async (req, res) =>{
    const {
        name
    } = req.body;
    
    var newFilePath = null
    if(req.file){
          newFilePath = ""+req.file.filename;
    } 

    message = {}
    if(isEmptyOrNull(name)){message.name = "Name is required"}

    if(Object.keys(message).length > 0){
        res.json({
            message: message,
            error: true
        })
        return;
    }

    const sql = "INSERT INTO laptop_category (name,image) VALUES (?,?)";
    const param = [name,newFilePath];
    const data = await db.query(sql,param);
    res.json({
        message: "Laptop Category added Successfully",
        data: data
    })
}


const update = async (req,res) =>{
    const {
        name,
        laptop_cate_id
    } = req.body;
    var newFilePath = null
    if(req.file){
          newFilePath = ""+req.file.filename;
    } 

    message = {}
    if(isEmptyOrNull(name)){message.name = "Name is required"}
    if(isEmptyOrNull(laptop_cate_id)){message.laptop_cate_id = "laptop_cate_id is required"}

    if(Object.keys(message).length > 0){
        res.json({
            message: message,
            error: true
        })
        return;
    }

    const sql = "UPDATE laptop_category SET name = ?, image = ? WHERE laptop_cate_id = ?";
    const param = [name,newFilePath,laptop_cate_id];
    const data = await db.query(sql,param);
    res.json({
        message: "Laptop Category updated Successfully",
        data: data
    })
}


const remove = async (req, res) => {
    const { laptop_cate_id } = req.params;
    const sql = "DELETE FROM `laptop_category` WHERE `laptop_cate_id` = ?";
    const data = await db.query(sql,[laptop_cate_id ]);
    res.json({
        message:"Laptop Category removed Successfully",
        data : data
    })
}

module.exports = {
    getAll,
    create,
    update,
    remove
}