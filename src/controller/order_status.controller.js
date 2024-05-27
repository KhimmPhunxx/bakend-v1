
const db = require("../util/db");

const getAll = async (req,res) =>{
    const sql = "SELECT * FROM order_status";
    const data = await db.query(sql);
    res.json({
        data : data
    })
}

const create = async (req,res) =>{
    const {name, message, sort_order} = req.body;
    const sql = "INSERT INTO order_status(name, message, sort_order) VALUES (?,?,?)";
    const param = [name, message, sort_order];
    const data = await db.query(sql,param);
    res.json({
        message:"Product added successfully",
        data : data
    })
}

const remove = async (req,res) =>{
    const {order_status_id} = req.body;
    const sql = "DELETE FROM order_status WHERE order_status_id = ?";
    const param = [order_status_id];
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
