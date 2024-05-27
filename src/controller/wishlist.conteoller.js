
const db = require("../util/db");

const getAll = async (req,res) =>{
    const {customer_id} = req.body;
    const sql = "SELECT * FROM wishlist WHERE customer_id = ?";
    const data = await db.query(sql,[customer_id]);
    res.json({
        data : data
    })
}

const create = async (req,res) =>{
    const {customer_id,product_id} = req.body;
    const sql = "INSERT INTO wishlist(customer_id,product_id) VALUES (?,?)";
    const param = [customer_id,product_id];
    const data = await db.query(sql,param);
    res.json({
        message:"Product added to wishlist",
        data : data
    })
}

const remove = async (req,res) =>{
    const {wishlist_id} = req.body;
    const sql = "DELETE FROM wishlist WHERE wishlist_id = ?";
    const param = [wishlist_id];
    const data = await db.query(sql,param);
    res.json({
        message:"Product removed from wishlist",
        data : data
    })
}

module.exports = {
    getAll,
    create,
    remove
}
