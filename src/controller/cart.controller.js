// 
const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");

const getCartByCustomer = async (req,res) =>{
    var {
        customer_id
    } = req.body;
    var sql = "SELECT c.cart_id, c.quantity, p.* FROM cart c"; 
    sql += " INNER JOIN product p ON (c.product_id = p.product_id)"; 
    sql += " WHERE c.customer_id = ?"; 
    let data = await db.query(sql,[customer_id]);
    res.json({
        List : data
    })
}

const addCart = async (req,res) => {
    const {
        customer_id,
        product_id,
        quantity
    } = req.body;

    var message = {}
    if (isEmptyOrNull(customer_id)){message.customer_id = "customer_id is required"}
    if (isEmptyOrNull(product_id)){message.product_id = "product_id is required"}
    if (isEmptyOrNull(quantity)){message.quantity = "quantity is required"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
           
        })
        return;
    }

    var sql = "INSERT INTO cart (customer_id,product_id,quantity) VALUES (?,?,?)";
    var param = [customer_id,product_id,quantity];
    var data = await db.query(sql,param);
    res.json({
        message: "Product added to cart Successfully",
        data: data
    })
}

const removeCart = async (req,res) => {
    const {cart_id} = req.body;
    const sql = "DELETE FROM cart WHERE cart_id = ?";
    let param = [cart_id];
    let data = await db.query(sql,param);
    res.json({
        message:"Product removed from cart Successfully",
        data : data
    })
}

const updateCart = async (req,res) => {
    const {
        cart_id,
        quantity // -1 | +1
    } = req.body;

    let message = {}
    if (isEmptyOrNull(cart_id)){message.cart_id = "cart_id is required"}
    if (isEmptyOrNull(quantity)){message.quantity = "quantity is required"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
           
        })
        return;
    }

    let sql = "UPDATE cart SET quantity =(quantity+?) WHERE cart_id = ?";
    let param = [quantity,cart_id];
    let data = await db.query(sql,param);
    res.json({
        message: "Product updated to cart Successfully",
        data: data
    })
}

module.exports = {
    getCartByCustomer,
    addCart,
    removeCart,
    updateCart
}