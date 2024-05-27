
const db = require('../util/db');
const { isEmptyOrNull, KEY_TOKEN } = require('../util/service');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getAll = async (req,res) =>{
    var sqlCustomer = "SELECT customer_id,firstname,lastname,username,gender,is_active,create_at FROM customer ORDER BY customer_id DESC";
    var sqlProvince = "SELECT * FROM province";
    var data = await db.query(sqlCustomer);
    var dataProvince = await db.query(sqlProvince);
    res.json({
        data : data,
        data_Province : dataProvince
    })
    
}

const getone = (req,res) =>{
    var id = req.params.id;
    var sql = "SELECT customer_id,firstname,lastname,gender,is_active,create_at FROM customer WHERE customer_id = ?";
    db.query(sql,[id],(err,result)=>{
        if(err){
            res.json({
                message:err,
                error:true
            })
        }else{
            res.json({
                data:result
            })
        }
    })
}

const create = (req,res) =>{
    db.beginTransaction()
    let {
        username, // store telephone
        password,
        firstname,
        lastname,
        gender,
        province_id,
        address_des
    } = req.body;

    // var filename = null
    // if(req.file){
    //     filename = req.file.filename
    // }

    // check validate parametor
    var message = {}
    if(isEmptyOrNull(username)){message.username = "username is required"}
    if(isEmptyOrNull(password)){message.password = "password is required"}
    if(isEmptyOrNull(firstname)){message.firstname = "firstname is required"}
    if(isEmptyOrNull(lastname)){message.lastname = "lastname is required"}
    if(isEmptyOrNull(gender)){message.gender = "Gender is required"}
    if(isEmptyOrNull(province_id)){message.province_id = "province_id is required"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return false;
    }
    // end validate parametor

    // check customer is existing by tel = username
    var sqlFind = "SELECT customer_id FROM customer WHERE username = ? "  // check customer by username
    db.query(sqlFind,[username],(err1,result1)=>{
        if(result1.length > 0){ // has record => exist customer
            res.json({
                error:true,
                message:"Account Already exist"
            })
            return false;
        }else{
            // bcrypt password from client
            // password = 12345 => "erqgv45764*fjwlt"
            password = bcrypt.hashSync(password,10);

            var sqlCustomer = "INSERT INTO customer (firstname, lastname, gender, username, password) VALUES (?,?,?,?,?)";
            var paramCustomer = [firstname, lastname, gender, username, password];
            db.query(sqlCustomer,paramCustomer,(err2,result2)=>{
                if(!err2){
                    // insert customer_address
                    var sqlCustomerAdd = "INSERT INTO customer_address (customer_id, province_id, firstname, lastname, tel,address_des) VALUES (?,?,?,?,?,?)";
                    var paramCustomerAdd = [result2.insertId, province_id, firstname, lastname, username,address_des];
                    db.query(sqlCustomerAdd,paramCustomerAdd,(err3,result3)=>{
                        if(!err3){
                            res.json({
                                message : "Account Create Success",
                                data : result3
                            })
                            db.commit()
                        }else{
                            res.json({
                                error : true,
                                message : err3
                            })
                            db.rollback()
                        }
                    })
                }
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
    var user = await db.query("SELECT * FROM customer WHERE username = ?",[username]);
    if(user.length > 0){
        var passDb = user[0].password;
        var isCorrect = bcrypt.compareSync(password,passDb);
        if(isCorrect){
            var user = user[0];
            delete user.password;
            var obj = {
                user:user,
                permission:[],
                token:""
            }
            var access_token = jwt.sign({data:{...obj}},KEY_TOKEN);

            res.json({
               ...obj,
               access_token : access_token
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

const update = (req,res) =>{ // update customer profile
    const {
        customer_id,
        firstname,
        lastname,
        gender,
       
    } = req.body;

    var message = {}
    if(isEmptyOrNull(customer_id)){message.customer_id = "customer_id is required"}
    if(isEmptyOrNull(firstname)){message.firstname = "firstname is required"}
    if(isEmptyOrNull(lastname)){message.lastname = "lastname is required"}
    if(isEmptyOrNull(gender)){message.gender = "gender is required"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return false;
    }


    var sql = "UPDATE customer SET firstname = ?,lastname = ? ,gender = ? WHERE customer_id = ?";
    var param_update = [firstname, lastname, gender, customer_id];
    db.query(sql,param_update,(err,result)=>{
        if(err){
            res.json({
                message:err,
                error:true
            })
        }else{
            res.json({
                message : result.affectedRows ? "Customer Update success" : "Customer id in not System" ,
                data:result
            })
        }
    })
    
}

const remove = (req,res) =>{
    // var sql = "DELETE FROM customer WHERE customer_id = ?";
    var sql = "UPDATE customer SET is_active = 0 WHERE customer_id = ?";
    db.query(sql,[req.params.id],(err,result)=>{
        if(err){
            res.json({
                message:err,
                error:true
            })
        }else{
            res.json({
                message : result.affectedRows ? "Customer Delete success" : "Customer id in not found" ,
                data:result
            })
        }
    })
}

const listAddress = (req,res) =>{
    const {
        customer_id
    } = req.body;
    var sql = "SELECT * FROM customer_address WHERE customer_id = ?";
    db.query(sql,[customer_id],(err,result)=>{
        if(!err){
            res.json({
                data : result
            })
        }
    })
}
const listOneAddress = (req,res) =>{
    const {
        customer_id,
    } = req.params;
    var sql = "SELECT * FROM customer_address WHERE customer_address_id = ?";
    db.query(sql,[customer_id,address_id],(err,result)=>{
        if(!err){
            res.json({
                data : result
            })
        }
    })
}

{
    
}
const newAddress = (req,res) =>{
    const {
        customer_id,
        province_id,
        firstname,
        lastname,
        tel,
        address_des
    } = req.body;

    var message = {}
    if(isEmptyOrNull(customer_id)){message.customer_id = "customer_id is required"}
    if(isEmptyOrNull(province_id)){message.province_id = "province_id is required"}
    if(isEmptyOrNull(firstname)){message.firstname = "firstname is required"}
    if(isEmptyOrNull(lastname)){message.lastname = "lastname is required"}
    if(isEmptyOrNull(tel)){message.tel = "tel is required"}
    if(isEmptyOrNull(address_des)){message.address_des = "address_des is required"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return false;
    }

    var sql = "INSERT INTO customer_address (customer_id, province_id, firstname, lastname, tel,address_des) VALUES (?,?,?,?,?,?)";
    var param = [customer_id, province_id, firstname, lastname, tel,address_des];
    db.query(sql,param,(err,result)=>{
        if(err){
            res.json({
                error:true,
                message:err
            })
        }else{
            res.json({
                message: result.affectedRows ? "Address Create Success" : "Address Create Fail",
                data:result
            })
        }
    })
}

const updateAddress = (req,res) =>{
    const {
        customer_address_id,
        customer_id,
        province_id,
        firstname,
        lastname,
        tel,
        address_des
    } = req.body;

    var message = {}
    if(isEmptyOrNull(customer_address_id)){message.customer_address_id = "customer_address_id is required"}
    if(isEmptyOrNull(customer_id)){message.customer_id = "customer_id is required"}
    if(isEmptyOrNull(province_id)){message.province_id = "province_id is required"}
    if(isEmptyOrNull(firstname)){message.firstname = "firstname is required"}
    if(isEmptyOrNull(lastname)){message.lastname = "lastname is required"}
    if(isEmptyOrNull(tel)){message.tel = "tel is required"}
    if(isEmptyOrNull(address_des)){message.address_des = "address_des is required"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return false;
    }

    var sql = "UPDATE customer_address SET customer_id = ?, province_id = ?, firstname = ?, lastname = ?, tel = ?,address_des = ? WHERE customer_address_id = ?";
    var param = [customer_id ,province_id, firstname, lastname, tel,address_des,customer_address_id];
    db.query(sql,param,(err,result)=>{
        if(err){
            res.json({
                error:true,
                message:err
            })
        }else{
            res.json({
                message: result.affectedRows ? "Address Update Success" : "Address Update Fail",
                data:result
            })
        }
    })
}

const removeAddress = (req,res) =>{
    var sql = "DELETE FROM customer_address WHERE customer_address_id = ?";
    db.query(sql,[req.params.id],(err,result)=>{
        if(err){
            res.json({
                message:err,
                error:true
            })
        }else{
            res.json({
                message : result.affectedRows ? "Customer Delete success" : "Customer id in not found" ,
                data:result
            })
        }
    })
}



module.exports = {
    getAll,
    getone,
    create,
    login,
    update,
    remove,
    listAddress,
    listOneAddress,
    newAddress,
    updateAddress,
    removeAddress
}