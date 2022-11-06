const express = require('express');
const res = require('express/lib/response');

const router = express.Router();

const jwt = require('jsonwebtoken');

var dbConn = require('../../config/db');

//INSERT
router.post('/add',(req,res)=> {
    const token = req.headers.authorization.split(' ')[1]
    if(!token){
        res.status(200).json({
            success: false,
            msg: "Error, token not found",
        });
    }


    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decodedToken);

    console.log(req.body);

    var agent_name = req.body.agent_name;
    var agent_address = req.body.agent_address;
    var agent_number = req.body.agent_number;
    var agent_age = req.body.agent_age;
    var agent_gender = req.body.agent_gender;
    var agent_email = req.body.agent_email;
    

    sqlQuery = `INSERT Into agent(agent_name, agent_address, agent_number, agent_age, agent_gender, agent_email)VALUES("${agent_name}","${agent_address}",${agent_number},${agent_age},"${agent_gender}","${agent_email}")`;

    dbConn.query(sqlQuery,function(error,results, fields){
        if(error)throw error;

        res.status(200).json(results);
    });
});

//SELECT

router.get('/view', (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if(!token){
        res.status(200).json({
            success: false,
            msg: "Error, token not found",
        });
    }


    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decodedToken);

    sqlQuery = `SELECT * FROM agent`;
   
   dbConn.query( sqlQuery, function( error, results, fields ){ 
   
       if (error) throw error;
   
           res.status(200).json(results);  
   
     });
});
    
//UPDATE
router.patch('/update/:agent_id', (req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
    if(!token){
        res.status(200).json({
            success: false,
            msg: "Error, token not found",
        });
    }


    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decodedToken);

    console.log('API Running');
    const agent_id = req.params.agent_id;
    dbConn.query(`SELECT agent_id FROM agent WHERE agent_id = ${agent_id}`, function(error, results, fields){
        if (error) throw error;

        else if (!results.length){
            console.log("ID does not exist")
            res.status(300).json("ID does not exist");
            return;
        }
        else{
            var agent_name = req.body.agent_name;
            var agent_address = req.body.agent_address;
            var agent_number = req.body.agent_number;
            var agent_age = req.body.agent_age;
            var agent_gender = req.body.agent_gender;
            var agent_email = req.body.agent_email;

            dbConn.query(`UPDATE agent SET agent_name = "${agent_name}", agent_address = "${agent_address}", agent_number = ${agent_number},
            agent_age = ${agent_age}, agent_gender = "${agent_gender}", agent_email = "${agent_email}"
             WHERE agent_id = ${agent_id}`, function(error, results, fields){
                console.log("Data Updated");
                if (error) return;
                res.status(300).json(results);
            });
        }
    });
});
//DELETE
router.delete('/delete/:agent_id', (req,res)=> {
    const token = req.headers.authorization.split(' ')[1]
    if(!token){
        res.status(200).json({
            success: false,
            msg: "Error, token not found",
        });
    }


    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decodedToken);
    
    console.log('API Running');
    const agent_id = req.params.agent_id;
    dbConn.query(`SELECT agent_id from agent WHERE agent_id = ${agent_id}`, function(error, results, fields){
        if (error) throw error;
        
        else if (!results.length) {
            console.log("ID does not exist")
            res.status(300).json("ID does not exist");
            return;
        }
        else{
            dbConn.query(`DELETE from agent WHERE agent_id = ${agent_id}`, function(error,results, fields){
                console.log("Data DELETED");
                if (error) return;
                res.status(300).json(results);
            });
        }
    });
});

module.exports = router;