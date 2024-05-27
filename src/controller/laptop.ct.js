const { isEmptyOrNull } = require("../util/service");
const db = require("../util/db");

const getAll = async (req,res) =>{
    try {
        const { categoryId} =  req.query;

        const select = "SELECT l.*, lc.name as name FROM laptop l" +
                " INNER JOIN laptop_category lc ON (l.laptop_cate_id = lc.laptop_cate_id)";

        var where = "";
        if(!isEmptyOrNull(categoryId)){
            where += " p.category_id = "+categoryId;
        }

        var order = " ORDER BY l.id DESC";  
        // var limit = " LIMIT "+limitItem+" OFFSET "+offset1+"";
        const data = await db.query(select+order+where);

        const sqlCate = "SELECT * FROM laptop_category";
        const dataCate = await db.query(sqlCate);
        res.json({
            data : data,
            dataCate : dataCate
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Internal Server Error",
            error: error
        })
    }
}

const create = async (req, res) =>{
    const {
        laptop_cate_id,
        name,
        price,
        desc,
        cpu,
        ram,
        storage,
        graphic,
        display,
        keyboard,
        os,
        weigh,
        warranty1,
        warranty2,
        free1,
        free2,
        free3
    } = req.body;
    
    var newFilePath = null
    if(req.file){
          newFilePath = ""+req.file.filename;
    } 

    message = {}
    if(isEmptyOrNull(name)){message.name = "Name is required"}
    if(isEmptyOrNull(price)){message.price = "Price is required"}
    if(isEmptyOrNull(desc)){message.desc = "Description is required"}
    if(isEmptyOrNull(cpu)){message.cpu = "CPU is required"}
    if(isEmptyOrNull(ram)){message.ram = "RAM is required"}
    if(isEmptyOrNull(storage)){message.storage = "Storage is required"}
    if(isEmptyOrNull(graphic)){message.graphic = "Graphic is required"}
    if(isEmptyOrNull(display)){message.display = "Display is required"}
    if(isEmptyOrNull(keyboard)){message.keyboard = "Keyboard is required"}
    if(isEmptyOrNull(os)){message.os = "OS is required"}
    if(isEmptyOrNull(weigh)){message.weigh = "Weigh is required"}
    if(isEmptyOrNull(warranty1)){message.warranty1 = "Warranty1 is required"}
    if(isEmptyOrNull(warranty2)){message.warranty2 = "Warranty2 is required"}
    if(isEmptyOrNull(free1)){message.free1 = "Free1 is required"}
    if(isEmptyOrNull(free2)){message.free2 = "Free2 is required"}
    if(isEmptyOrNull(free3)){message.free3 = "Free3 is required"}

    if(Object.keys(message).length > 0){
        res.json({
            message: message,
            error: true
        })
        return;
    }

    let sql = "INSERT INTO `laptop` (`laptop_cate_id`, `name`, `price`, `desc`, `cpu`, `ram`, `storage`, `graphic`, `display`, `keyboard`, `os`, `weigh`, `warranty1`, `warranty2`, `free1`, `free2`, `free3`, `lt_image`)" +
              " VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    let param_create = [
        laptop_cate_id,
        name,
        price,
        desc,
        cpu,
        ram,
        storage,
        graphic,
        display,
        keyboard,
        os,
        weigh,
        warranty1,
        warranty2,
        free1,
        free2,
        free3,
        newFilePath
    ];

    db.query(sql,param_create,(err,result)=>{
        if(err){
            res.json({
                message:err,
                error:true
            })
        }else{
            res.json({
                data_laptop: result,
                message: "Create data laptop success"
            })
        }
    })
}

const update = async (req, res) =>{
    const {
        id,
        laptop_cate_id,
        name,
        price,
        desc,
        cpu,
        ram,
        storage,
        graphic,
        display,
        keyboard,
        os,
        weigh,
        warranty1,
        warranty2,
        free1,
        free2,
        free3
    } = req.body;

    var newFilePath = null
    if(req.file){
          newFilePath = ""+req.file.filename;
    } 

    message = {}
    if(isEmptyOrNull(name)){message.name = "Name is required"}
    if(isEmptyOrNull(price)){message.price = "Price is required"}
    if(isEmptyOrNull(desc)){message.desc = "Description is required"}
    if(isEmptyOrNull(cpu)){message.cpu = "CPU is required"}
    if(isEmptyOrNull(ram)){message.ram = "RAM is required"}
    if(isEmptyOrNull(storage)){message.storage = "Storage is required"}
    if(isEmptyOrNull(graphic)){message.graphic = "Graphic is required"}
    if(isEmptyOrNull(display)){message.display = "Display is required"}
    if(isEmptyOrNull(keyboard)){message.keyboard = "Keyboard is required"}
    if(isEmptyOrNull(os)){message.os = "OS is required"}
    if(isEmptyOrNull(weigh)){message.weigh = "Weigh is required"}
    if(isEmptyOrNull(warranty1)){message.warranty1 = "Warranty1 is required"}
    if(isEmptyOrNull(warranty2)){message.warranty2 = "Warranty2 is required"}
    if(isEmptyOrNull(free1)){message.free1 = "Free1 is required"}
    if(isEmptyOrNull(free2)){message.free2 = "Free2 is required"}
    if(isEmptyOrNull(free3)){message.free3 = "Free3 is required"}

    if(Object.keys(message).length > 0){
        res.json({
            message: message,
            error: true
        })
        return;
    }

    let sql = "UPDATE `laptop` SET `laptop_cate_id` = ?, `name` = ?, `price` = ?, `desc` = ?, `cpu` = ?, `ram` = ?, `storage` = ?, `graphic` = ?, `display` = ?, `keyboard` = ?, `os` = ?, `weigh` = ?, `warranty1` = ?, `warranty2` = ?, `free1` = ?, `free2` = ?, `free3` = ?, `lt_image` = ? WHERE `id` = ?";
    let param_update = [
        laptop_cate_id,
        name,
        price,
        desc,
        cpu,
        ram,
        storage,
        graphic,
        display,
        keyboard,
        os,
        weigh,
        warranty1,
        warranty2,
        free1,
        free2,
        free3,
        newFilePath,
        id
    ];

    db.query(sql,param_update,(err,result)=>{
        if(err){
            res.json({
                message:err,
                error:true
            })
        }else{
            res.json({
                data_laptop: result,
                message: "Update data laptop success"
            })
        }
    })
}

// params
const remove = async (req, res) =>{
    const { id } = req.params;
    const sql = "DELETE FROM `laptop` WHERE `id` = ?";
    const data = await db.query(sql,[id]);
    res.json({
        data : data
    })
}


module.exports = {
    getAll,
    create,
    update,
    remove
}