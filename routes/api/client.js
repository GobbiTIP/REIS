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

    var client_name = req.body.client_name;
    var client_address = req.body.client_address;
    var client_number = req.body.client_number;
    var client_age = req.body.client_age;
    var client_gender = req.body.client_gender;
    var client_email = req.body.client_email;
    

    sqlQuery = `INSERT Into client(client_name, client_address, client_number, client_age, client_gender, client_email)VALUES("${client_name}","${client_address}",${client_number},${client_age},"${client_gender}","${client_email}")`;

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



    sqlQuery = `SELECT * FROM client`;
   
   dbConn.query( sqlQuery, function( error, results, fields ){ 
   
       if (error) throw error;
   
           res.status(200).json(results);  
   
     });
});
    
//UPDATE
router.patch('/update/:client_id', (req,res)=>{
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
    const client_id = req.params.client_id;
    dbConn.query(`SELECT client_id FROM client WHERE client_id = ${client_id}`, function(error, results, fields){
        if (error) throw error;

        else if (!results.length){
            console.log("ID does not exist")
            res.status(300).json("ID does not exist");
            return;
        }
        else{
            var client_name = req.body.client_name;
            var client_address = req.body.client_address;
            var client_number = req.body.client_number;
            var client_age = req.body.client_age;
            var client_gender = req.body.client_gender;
            var client_email = req.body.client_email;

            dbConn.query(`UPDATE client SET client_name = "${client_name}", client_address = "${client_address}", client_number = ${client_number},
             client_age = ${client_age}, client_gender = "${client_gender}", client_email = "${client_email}"
             WHERE client_id = ${client_id}`, function(error, results, fields){
                console.log("Data Updated");
                if (error) return;
                res.status(300).json(results);
            });
        }
    });
});
//DELETE
router.delete('/delete/:client_id', (req,res)=> {
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
    const client_id = req.params.client_id;
    dbConn.query(`SELECT client_id from client WHERE client_id = ${client_id}`, function(error, results, fields){
        if (error) throw error;
        
        else if (!results.length) {
            console.log("ID does not exist")
            res.status(300).json("ID does not exist");
            return;
        }
        else{
            dbConn.query(`DELETE from client WHERE client_id = ${client_id}`, function(error,results, fields){
                console.log("Data DELETED");
                if (error) return;
                res.status(300).json(results);
            });
        }
    });
});

module.exports = router;
