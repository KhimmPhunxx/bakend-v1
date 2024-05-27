const { isEmptyOrNull } = require("../util/service");
const db = require("../util/db");

// table pc_hw

const getAll = async (req,res) =>{
    const sql = "SELECT * FROM `pc_hw`";
    const data = await db.query(sql);
    res.json({
        data : data
    })
}

module.exports = {
    getAll
}