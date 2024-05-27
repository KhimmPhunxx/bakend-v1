
const db = require("../util/db");
const { isEmptyOrNull, KEY_REFRESH } = require("../util/service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { KEY_TOKEN } = require("../util/service");
const { getPermissionByUser } = require("./auth.controller");

const getAll = (req,res) => {
    var sql = "SELECT employee_id, role_id, firstname, lastname, tel, email, base_salary, address, province, country, creat_at, image_empl FROM employee ORDER BY employee_id DESC";
    db.query(sql,(err,result)=>{
        if(err) { // has error
            res.json({
                message : err,
                error : true
            })
        }else{ // success
            res.json({
                user: req.user,
                user_id : req.user.employee_id ,
                list_employee : result,
                
            })
        } 
    })
}

// params from client
const getone = (req,res) => {
    var id = req.params.id;
    var sql = "SELECT * FROM employee WHERE employee_id = ?";
    db.query(sql,[id],(err,result)=>{
        if(err) { // has error
            res.json({
                message : err,
                error : true
            })
        }else{ // success
            res.json({
                list : result,

            })
        } 
    })
}

const login =  async (req,res) =>{
    var {username,password} = req.body;
    var messsage = {}
    if(isEmptyOrNull(username)){messsage.username = "Please fill in username"}
    if(isEmptyOrNull(password)){messsage.password = "Please fill in password"}
    if(Object.keys(messsage).length > 0){
        res.json({
            error:true,
            message:messsage
        })
        return false;
    }
    var user = await db.query("SELECT * FROM employee WHERE tel = ?",[username]);
    if(user.length > 0){
        var passDb = user[0].password;
        var isCorrect = bcrypt.compareSync(password,passDb);
        if(isCorrect){
            var user = user[0];
            delete user.password;
            var permission = await getPermissionByUser(user.employee_id);
            var obj = {
                user:user,
                permission:permission
            }
            var access_token = jwt.sign({data:{...obj}},KEY_TOKEN,{expiresIn:"10h"});
            var refresh_token = jwt.sign({data:{...obj}},KEY_REFRESH);
            res.json({
                ...obj,
                access_token : access_token,
                refresh_token : refresh_token,
            })
        }else{
            res.json({
                error:true,
                message:"Password is incorrect"
            })
        }
    }else{
       res.json({
              message:"Acount don't exist!. Please go to register",
              error:true,
         })
    }
}

const refreshToken = async (req,res) => {
    var {refresh_key} = req.body;
    if(isEmptyOrNull(refresh_key)){
        res.status(401).send({
            message:"Unauthorized"
        })
    }else{
        jwt.verify(refresh_key,KEY_REFRESH,async (err,result)=>{
            if(err){
                res.status(401).send({
                    message:"Unauthorized",
                    error: err
                })
            }else{

                var username = result.data.user.tel;
                var user = await db.query("SELECT * FROM employee WHERE tel = ?",[username]);
                var user = user[0];
                delete user.password;
                var permission = await getPermissionByUser(user.employee_id);
                var obj = {
                    user:user,
                    permission:permission
                }
                var access_token = jwt.sign({data:{...obj}},KEY_TOKEN,{expiresIn:"1h"});
                var refresh_token = jwt.sign({data:{...obj}},KEY_REFRESH);
                res.json({
                    ...obj,
                    access_token : access_token,
                    refresh_token : refresh_token,
                })
            }
        })
    }

}

const setPassword = async (req,res) => {
    var {
        username,
        password
    } = req.body;
    var message = {}
    if(isEmptyOrNull(username)){message.username = "Pleas fill username"}
    if(isEmptyOrNull(password)){message.password = "Pleas fill password"}
    if(Object.keys(message).length > 0){
        res.json({
            message : message,
            error : true
        })
        return;
    }

    var employee = await db.query("SELECT * FROM employee WHERE tel = ?",[username]);
    if(employee.length > 0){
        // var passDb = user[0].password;
        var passwordGenerate = await bcrypt.hash(password,10);
        var update = await db.query("UPDATE employee SET password = ? WHERE tel = ?",[passwordGenerate,username]);
        res.json({
            message:"Password change successfully!!"
        })
    }else{
       res.json({
              message:"Acount don't exist!. Please go to register",
              error:true,
         })
    }

}

const create = (req,res) => {
    var {
        firstname,
        lastname,
        tel,
        password,
        email,
        base_salary,
        address,
        province,
        country
    } = req.body;
   
    var newFilePath = null
    if(req.file){
          newFilePath = req.file.filename;
    } 

    var message = {}
    if(isEmptyOrNull(firstname)){
        message.firstname = "firstname is required"
    }
    if(isEmptyOrNull(lastname)){
        message.lastname = "lastname is required"
    }
    if(isEmptyOrNull(tel)){
        message.tel = "tel is required"
    }
    if(Object.keys(message).length > 0){
        res.json({
            message : message,
            error : true
        })
        return;
    }
    var passwordGenerate = bcrypt.hashSync(password,10);

    var sql = "INSERT INTO employee (firstname,lastname,tel,password,email,base_salary,address,province,country,image_empl) VALUES (?,?,?,?,?,?,?,?,?,?)";
    var param_create = [
        firstname,
        lastname,
        tel,
        passwordGenerate,
        email,
        base_salary,
        address,
        province,
        country,
        newFilePath
    ];
    db.query(sql,param_create,(err,result)=>{
        if(err) { // has error
            res.json({
                error : true,
                message : err
            })
        }else{ // success
            res.json({
                message : "Employee Create success",
                data : result,
            })
        } 
    })
}

const update = async (req,res) => {
    const {
        employee_id,
        firstname,
        lastname,
        tel,
        email,
        base_salary,
        address,
        province,
        country
    } = req.body;
    var filename = null
    if(req.file){
        filename = req.file.filename
    }

    var message = {}
    if(isEmptyOrNull(employee_id)){
        message.employee_id = "employee_id is required"
    }
    if(isEmptyOrNull(firstname)){
        message.firstname = "firstname is required"
    }
    if(isEmptyOrNull(lastname)){
        message.lastname = "lastname is required"
    }
    if(isEmptyOrNull(tel)){
        message.tel = "tel is required"
    }
    if(Object.keys(message).length > 0){
        res.json({
            message : message,
            error : true
        })
        return;
    }
    var sql = "UPDATE employee SET firstname = ?,lastname = ?,tel = ?,email = ?,base_salary = ?,address = ?,province = ?,country = ?, image_empl = ? WHERE employee_id = ?";
    var param_update = [
        firstname,
        lastname,
        tel,
        email,
        base_salary,
        address,
        province,
        country,
        filename,
        employee_id,

    ];
    var data = await db.query(sql,param_update);
    res.json({
        message : "Employee Update success",
        data : data,
    })
}

const remove = (req,res) => {
    // var id = req.params.id;
    var {id} = req.params;
    var sql = "DELETE FROM employee WHERE employee_id = ?";
    var param_delete = [id];
    db.query(sql,param_delete,(err,result)=>{

        if(!err){
            res.json({
                message : (result.affectedRows) ? "Employee Delete success" : "Employee id not Found",
                data : result,
            })
        }else{
            res.json({
                message : err,
                error : true
            })
        }
    })
}

module.exports = {
    getAll,
    getone,
    create,
    update,
    remove,
    login,
    setPassword,
    refreshToken
    
}