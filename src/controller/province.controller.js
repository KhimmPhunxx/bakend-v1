

// 
const db = require('../util/db');

const getAll = async (req,res) =>{
    const sql = "SELECT * FROM province";
    const data = await db.query(sql);
    res.json({
        data : data
    })
}

module.exports = {
    getAll
}