const db = require("../util/db");
const getAll = async (req,res) =>{
    const sql = "SELECT odt.*, pd.name, od.invoice_id, od.create_at FROM order_detail odt" +
    " INNER JOIN product pd ON (odt.product_id = pd.product_id)" +
    " INNER JOIN `order` od ON (odt.order_id = od.order_id)" +
    " ORDER BY odt.order_detail_id DESC";
    const data = await db.query(sql);
    res.json({
        data : data
    })
}

module.exports = {
    getAll
}
