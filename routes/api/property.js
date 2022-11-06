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

    var property_type = req.body.property_type;
    var property_location = req.body.property_location;
    var property_room = req.body.property_room;

    

    sqlQuery = `INSERT Into property(property_type, property_location, property_room)VALUES("${property_type}","${property_location}",${property_room})`;

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

    sqlQuery = `SELECT * FROM property`;
   
   dbConn.query( sqlQuery, function( error, results, fields ){ 
   
       if (error) throw error;
   
           res.status(200).json(results);  
   
     });
});
    
//UPDATE
router.patch('/update/:property_id', (req,res)=>{
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
    const property_id = req.params.property_id;
    dbConn.query(`SELECT property_id FROM property WHERE property_id = ${property_id}`, function(error, results, fields){
        if (error) throw error;

        else if (!results.length){
            console.log("ID does not exist")
            res.status(300).json("ID does not exist");
            return;
        }
        else{
            var property_type = req.body.property_type;
            var property_location = req.body.property_location;
            var property_room = req.body.property_room;

            dbConn.query(`UPDATE property SET property_type = "${property_type}", property_location = "${property_location}", property_room = ${property_room}
             WHERE property_id = ${property_id}`, function(error, results, fields){
                console.log("Data Updated");
                if (error) return;
                res.status(300).json(results);
            });
        }
    });
});
//DELETE
router.delete('/delete/:property_id', (req,res)=> {
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
    const property_id = req.params.property_id;
    dbConn.query(`SELECT property_id from property WHERE property_id = ${property_id}`, function(error, results, fields){
        if (error) throw error;
        
        else if (!results.length) {
            console.log("ID does not exist")
            res.status(300).json("ID does not exist");
            return;
        }
        else{
            dbConn.query(`DELETE from property WHERE property_id = ${property_id}`, function(error,results, fields){
                console.log("Data DELETED");
                if (error) return;
                res.status(300).json(results);
            });
        }
    });
});

module.exports = router;