const db = require("../util/db");

const getAll = async (req,res) =>{
    const sql = "SELECT * FROM `blog_home_page`";
    const data = await db.query(sql);
    res.json({
        data : data
    })
}

const create = async (req,res) =>{
    const {name,desc} = req.body;
    var filename = null
    if(req.file){ // true when have upload file from client
        filename = req.file.filename // get filename for store to database
    }
    const sql = "INSERT INTO `blog_home_page`(`name`, `desc`, `blog_image`) VALUES (?,?,?)";
    const data = await db.query(sql,[name,desc,filename]);
    res.json({
        data : data
    })
}

const remove = async (req,res) =>{
    const {blog_home_id} = req.body;
    const sql = "DELETE FROM `blog_home_page` WHERE blog_home_id = ?";
    const param = [blog_home_id];
    const data = await db.query(sql,param);
    res.json({
        message : "Delete Successfully",
        data : data
    })
}

const update = async (req,res) =>{
    const {blog_home_id,name,desc} = req.body;
    var filename = null
    if(req.file){ // true when have upload file from client
        filename = req.file.filename // get filename for store to database
    }
    const sql = "UPDATE `blog_home_page` SET `name`=?,`desc`=?,`blog_image`=? WHERE blog_home_id = ?";
    const param = [name,desc,filename,blog_home_id];
    const data = await db.query(sql,param);
    res.json({
        message : "Update Successfully",
        data : data
    })
}

module.exports = {
    getAll,
    create,
    remove,
    update
}
