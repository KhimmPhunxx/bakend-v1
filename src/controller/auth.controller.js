const jwt = require("jsonwebtoken");
const { KEY_TOKEN } = require("../util/service");
const db = require("../util/db");


exports.userGuard = (parameter) => { 
    return (req,res,next) => { 
        var authorization = req.headers.authorization;  // token from client
        var token_from_client = null;
        if(authorization != null && authorization != ""){
            token_from_client = authorization.split(" ");
            token_from_client = token_from_client[1];
        }
        if(token_from_client == null){
            res.status(401).send({
                message:"Unauthorized",
            });
        }else{
            jwt.verify(token_from_client,KEY_TOKEN,(err,result)=>{
                if(err){
                    res.status(401).send({
                        message:"Unauthorized",
                        error:err
                    });
                }else{
                    var permission = result.data.permission;
                    if(permission.includes(parameter)){
                        req.user = result.data;
                        req.user_id = result.data.user_id;
                        next();
                    }else{
                        res.status(401).send({
                            message:"Unauthorized"
                        });
                    }
                }
            })
        }
     }
 }

exports.userGuardV1 = (req,res,next) => {  // get access token from client
    
}

exports.getPermissionByUser = async (employee_id) =>{

    var sql = "SELECT"+
    " p.code"+
    " FROM employee c"+
    " INNER JOIN role r ON (c.role_id = r.role_id)"+
    " INNER JOIN role_permission rp on r.role_id = rp.role_id"+
    " INNER JOIN permission p ON rp.permission_id = p.permission_id"+
    " WHERE c.employee_id = ?;"
    var list = await db.query(sql,[employee_id]);
    var tempArr = [];
    list.map((item, index)=>{
        tempArr.push(item.code);
    })
    return tempArr;
}