/**
 * Created by wangct on 2018/6/3.
 */


const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const ffmpeg = require('fluent-ffmpeg');
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
    let filePath = req.query.path;
    fs.exists(filePath, exists => {
        if(exists){
            let extname = path.extname(filePath).substr(1);
            if(extname === 'mp4'){
                sendMp4(filePath,req,res);
            }else{
                let outPath = filePath.replace('.' + extname,'_transform_mp4.mp4');
                fs.exists(outPath,exists => {
                    if(exists){
                        sendMp4(outPath,req,res);
                    }else{
                        ffmpeg(filePath).format('mp4').output(outPath).on('end',(err,record) => {
                            sendMp4(outPath,req,res);
                        }).run();
                    }
                });
            }
        }else{
            res.status(404).send('path is no found!');
        }
    })
});


const sendMp4 = (filePath,req,res) => {
    fs.stat(filePath,(err,stat) => {
        if(err){
            res.status(500).send('path is error');
        }else if(stat.isFile()){
            let {headers = {}} = req;
            res.type(mime.lookup('mp4'));
            let {range = ''} = headers;
            let temp = range.replace('bytes','').split('-');
            let start = +temp[0] || 0;
            let end = +temp[1] || stat.size - 1;
            let readStream = fs.createReadStream(filePath,{
                start,
                end
            });
            res.set('Accept-Ranges','bytes');
            res.set('Content-Range',`bytes ${start}-${end}/${stat.size}`);
            res.set('Content-Length',end - start + 1);
            readStream.pipe(res);
            readStream.on('close',() => {
                console.log(filePath + '请求关闭了');
                res.end();
            });
        }else{
            res.status(404).send('path is no found!');
        }
    });
};

module.exports = router;