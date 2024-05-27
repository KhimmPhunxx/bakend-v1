# install Express
 > npm init
 > npm install express


 # Connnect data base
  > npm install mysql2
const mysql = require('mysql2');

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'preycode_g1'
})

module.exports = db;

# call data from database
// query
// params
// body
app.get("/employee",(req,res)=>{
    // var sql = "SELECT employee_id, firstname, lastname, base_salary FROM employee";
    // var id = req.query.id;
    var base_salary = req.query.base_salary;
    var province = req.query.province;
    var sql = "SELECT * FROM employee WHERE base_salary >= ? OR province = ?";
    db.query(sql,[base_salary,province],(err,result)=>{
        if(err) { // has error
            res.json({
                message : err,
            })
        }else{ // success
            res.json({
                list : result,
                
            })
        }
    })
})


"fieldCount": 0,
"affectedRows": 1,
"insertId": 0,
"info": "",
"serverStatus": 2,
"warningStatus": 0,
"changedRows": 0