/**
 * Created by wangct on 2018/6/3.
 */


const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const targetPath = path.resolve(__dirname,'../json/videoList.json');

router.get('/getList',(req,res) => {
    fs.readFile(targetPath,(err,data) => {
        if(err){
            console.log(err);
            res.status(500).send('error');
        }else{
            res.send(data);
        }
    });
});

router.get('/getFile',(req,res) => {
    let {params = {},headers} = req;
    let {range = {}} = headers;
    console.log(params);
    console.log(headers);
});


module.exports = router;