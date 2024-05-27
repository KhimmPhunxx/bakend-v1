// 
const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");

const getlist = async (req, res) => {
    try {
        const { categoryId, txtSearch, productStatus} =  req.query;
 
        let select = "SELECT p.*, c.name as category_name FROM product p"+
        " INNER JOIN category c ON (p.category_id = c.category_id) ";
        
        var where = "";
        if(!isEmptyOrNull(categoryId)){
            where += " p.category_id = "+categoryId;
        }
        if(!isEmptyOrNull(txtSearch)){
            where += (where != "" ? " AND " : "") + " p.name LIKE '"+ txtSearch+ "'";
        }
        if(!isEmptyOrNull(productStatus)){
            where += (where != "" ? " AND " : "") + " p.is_active = "+ productStatus;
        }
        if(where != ""){
            where = " WHERE "+where;
        }

        var order = " ORDER BY p.product_id DESC";
        // var limit = " LIMIT "+limitItem+" OFFSET "+offset1+"";
        var sql = select + where + order 
        const data = await db.query(sql);
        var barnd = [
            {
                id : 1,
                name : "Apple"
            },
            {
                id : 2,
                name : "ASUS"
            },
            {
                id : 3,
                name : "Dell"
            },
            

        ]
        
        var slqCategory = "SELECT * FROM category";
        const dataCategory = await db.query(slqCategory);
        res.json({
            data: data,
            data_category: dataCategory,
            data_brand : barnd,

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Internal Server Error",
            error: error
        })
    }
}

const getone = async (req, res) => {
    let {
        id
    } = req.params;
    const sql = "SELECT * FROM product WHERE product_id = ?" ;
    const data = await db.query(sql, [id]);
    res.json({
        data: data
    })
}

const create = async (req, res) => {
    let {
        category_id,
        barcode,
        name,
        quantity,
        price,
        description,
    } = req.body;
    var filename = null
    if(req.file){ // true when have upload file from client
        filename = req.file.filename // get filename for store to database
    }
    let message = {}
    if (isEmptyOrNull(category_id)){message.category_id = "category_id is required"}
    if (isEmptyOrNull(barcode)){message.barcode = "barcode is required"}
    if (isEmptyOrNull(name)){message.name = "name is required"}
    if (isEmptyOrNull(quantity)){message.quantity = "quantity is required"}
    if (isEmptyOrNull(price)){message.price = "price is required"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
           
        })
        return;
    }

    let sql = "INSERT INTO product (category_id,barcode,name,quantity,price,image,description) VALUES (?,?,?,?,?,?,?)";
    let param = [category_id,barcode,name,quantity,price,filename,description];
    let data = await db.query(sql, param);
    res.json({
        message: "Product added successfully",
        data: data
    })
}

const update = async (req, res) => {
    let {
        product_id,
        category_id,
        barcode,
        name,
        quantity,
        price,
        description,
    } = req.body;
    var filename = null
    if(req.file){ // true when have upload file from client
        filename = req.file.filename // get filename for store to database
    }

    let message = {}
    if (isEmptyOrNull(product_id)){message.productid = "product_id is required"}
    if (isEmptyOrNull(category_id)){message.category_id = "category_id is required"}
    if (isEmptyOrNull(barcode)){message.barcode = "barcode is required"}
    if (isEmptyOrNull(name)){message.name = "name is required"}
    if (isEmptyOrNull(quantity)){message.quantity = "quantity is required"}
    if (isEmptyOrNull(price)){message.price = "price is required"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
           
        })
        return;
    }

    let sql = "UPDATE product SET category_id = ?,barcode = ?,name = ?,quantity = ?,price = ?,image = ?,description = ? WHERE product_id = ?";
    let param = [category_id,barcode,name,quantity,price,filename,description,product_id];
    let data = await db.query(sql, param);
    res.json({
        message: "Product updated successfully",
        data: data
    })

}

const remove = async (req, res) => {
    let {
        id
    } = req.body;
    const sql = "DELETE FROM product WHERE product_id = ?";
    const data = await db.query(sql, [id]);
    res.json({
        message: "Product removed successfully",
        data: data
    })
   
}

const changeProductStatus = async (req, res) => {
    let {
      is_active
    } = req.body; // 1 or 0
    const sql = "UPDATE product SET is_active = ? WHERE product_id = ?";
    const data = await db.query(sql, [is_active]);
    res.json({
        message: "Product Update Status to"+(is_active == 0 ? "InActive" : "Active")+"successfully",
        data: data
    })
    
}

module.exports = {
    getlist,
    getone,
    create,
    update,
    remove,
    changeProductStatus
}