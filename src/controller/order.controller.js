
// 
const db = require("../util/db");
const { isEmptyOrNull, invoiceNumber } = require("../util/service");

const generateInvoiceNo = async () =>{
    let data = await db.query("SELECT MAX(order_id) as id FROM `order`");
    return invoiceNumber(data[0].id + 1);
}

const getAll = async (req,res) =>{
    var sql = "SELECT od.*, os.name, pmt.name_pm FROM `order` od "+
    " INNER JOIN order_status os ON (od.order_status_id = os.order_status_id)" +
    " INNER JOIN payment_method pmt ON (od.payment_method_id = pmt.payment_method_id) " +
    " ORDER BY od.order_id DESC"; 
    const data = await db.query(sql);
    res.json({
        data : data,
    })
}

const getone = async (req,res) =>{
    const {id} = req.params;
    const data = await db.query("SELECT * FROM order WHERE order_id = ?",[id]);
    res.json({
        data : data
    })
}

const getOrderByCustomer = async (req,res) =>{
    const {customer_id} = req.body;
    const data = await db.query("SELECT * FROM order WHERE customer_id = ?",[customer_id]);
    res.json({
        data : data
    })
}

const create = async (req,res) =>{
   try{
        db.beginTransaction();
        const {
            customer_id,
            customer_address_id,
            payment_method_id,
            comment,
        } = req.body;

        let message = {}
        if(isEmptyOrNull(customer_id)){message.customer_id = "customer_id is required"}
        if(isEmptyOrNull(payment_method_id)){message.payment_method_id = "payment_method_id is required"}
        if(isEmptyOrNull(customer_address_id)){message.customer_address_id = "customer_address_id is required"}
        if(Object.keys(message).length > 0){
            res.json({
                error:true,
                message:message
            })
            return;
        }

        // find customer address
        let address = await db.query("SELECT * FROM customer_address WHERE customer_address_id = ?",[customer_address_id]);
        
        if(address?.length > 0){
                const {firstname,lastname,tel,address_des} = address[0];
            
                // find total order cart inner join product
                let product = await db.query("SELECT c.*, p.price FROM cart c INNER JOIN product p ON (c.product_id = p.product_id) WHERE c.customer_id = ?",[customer_id]);
                if(product.length > 0){
                    // find order total amount base from cart
                let order_total = 0;
                product.map((item, index)=>{
                    order_total += item.price * item.quantity;
                })
            
                // insert data to order table
                var order_status_id = 1;
                var invoice_no = await generateInvoiceNo();
                var sqlOrder = "INSERT INTO `order` (customer_id, payment_method_id, order_status_id, invoice_id, comment, order_total, firstname, lastname, tel, address_des) VALUES (?,?,?,?,?,?,?,?,?,?)";
                let sqlOrderParam = [customer_id, payment_method_id,order_status_id, invoice_no, comment, order_total, firstname, lastname, tel, address_des];
                const order = await db.query(sqlOrder,sqlOrderParam);
                
                // insert order_detail
                product.map( async (item,index)=>{
                    let orderDetail = "INSERT INTO order_detail (order_id,product_id,quantity,price) VALUES (?,?,?,?)";
                    let orderDetailParam = [order.insertId  ,item.product_id,item.quantity,item.price];
                    const sqlOrderDetail = await db.query(orderDetail,orderDetailParam);

                    // cut stock from table product 
                    let sqlProduct = "UPDATE product SET quantity = (quantity - ?) WHERE product_id = ?";
                    let sqlProductParam = [item.quantity, item.product_id];
                    await db.query(sqlProduct,sqlProductParam);
                })

                // delete cart by customer
                await db.query("DELETE FROM cart WHERE customer_id = ?",[customer_id]);
                res.json({
                    message:"Your order has been successfully",
                    data : order
                })
                db.commit();
            }else{
                res.json({
                    message:"Your cart is empty",
                    error:true
                })
            } 
        }

    }catch(err){
        db.rollback();
        res.json({
            message:err,
            error:true
        })
   }
}

const update = async (req,res) =>{}

const remove = async (req,res) =>{}

module.exports = {
    getAll,
    getone,
    getOrderByCustomer,
    create,
    update,
    remove
}
