
const db = require('../util/db');
const { isEmptyOrNull } = require('../util/service');

const getAll = async (req,res) =>{
    const data_category = await db.query("SELECT * FROM category ORDER BY category_id DESC");
    res.json({
        data_category : data_category,
    })
}

const getone = async (req,res) =>{
    // ----------- use Async Await function -----------
    const {id} = req.params;
    // ----- query from database mysql with xampp ------
    const data_category = await db.query("SELECT * FROM category WHERE category_id = ?",[id]); 
    res.json({
        data_category : data_category,
    })
}

const create = (req,res) =>{
   const {
     name,
     description,
     parent_id,
     status
   } = req.body;

   var filename = null
    if(req.file){
         filename = req.file.filename
    }

    var message = {}
    if(isEmptyOrNull(name)){
        message.name = "name is required"
        res.json({
            message:message,
            error:true
        })
        return;
    } 


    var sql = "INSERT INTO category (name,description,parent_id,status,cate_image) VALUES (?,?,?,?,?)";
    var param_create = [
        name,
        description,
        parent_id,
        status,
        filename
    ];
    db.query(sql,param_create,(err,result)=>{
        if(err){
            res.json({
                message:err,
                error:true
            })
        }else{
            res.json({
                data:result
            })
        }
    })

}

const update = (req,res) =>{
    const {
        category_id,
        name,
        description,
        parent_id,
        status
    } = req.body;

    var filename = null
    if(req.file){
         filename = req.file.filename
    }

    var message = {}
    if(isEmptyOrNull(name)){
        message.name = "name is required"
        res.json({
            message:message,
            error:true
        })
        return;
    }else if(isEmptyOrNull(category_id)){
        message.name = "category_i is required"
        res.json({
            message:message,
            error:true
        })
        return;
    }


    var sql = "UPDATE category SET name = ?,description = ? ,parent_id = ?,status = ?, cate_image = ? WHERE category_id = ?";
    var param_update = [
        name,
        description,
        parent_id,
        status,
        filename,
        category_id,
       
    ];
    db.query(sql,param_update,(err,result)=>{
        if(err){
            res.json({
                message:err,
                error:true
            })
        }else{
            res.json({
                message : result.affectedRows ? "Category Update success" : "Category id in not found" ,
                data:result
            })
        }
    })
    
}


const remove = async (req,res) =>{
    var {category_id} = req.body;
    var sql = "DELETE FROM category WHERE category_id = ?";
    var param = [category_id];
    var data = await db.query(sql,param);
    res.json({
        message:"Product removed successfully",
        data : data
    })
}



module.exports = {
    getAll,
    getone,
    create,
    update,
    remove
}