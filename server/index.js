/**
 * Created by Administrator on 2018/1/3.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const config = require('./config');
const wt = require('../src/util/server');


const router = require('../router/video');

const app = express();
const port = config.port || 8888;


/**
 * 静态资源处理
 * @type {*|Array}
 */
let staticName = config.staticName || [];
if(!wt.isArray(staticName)){
    staticName = [staticName];
}
staticName.forEach(name => {
    app.use('/' + name,express.static(path.resolve(__dirname,'..',name)));
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret:'wangct',
    name:'ssid',
    cookie:{
        maxAge:6000,
        secret:true
    },
    resave:false,
    saveUninitialized:true
}));

/***********************/
app.use('/',(req,res,next) => {
    console.log('请求地址：' + req.url);
    let headers = config.responseHeaders;
    for(let name in headers){
        if(headers.hasOwnProperty(name)){
            res.setHeader(name,headers[name]);
        }
    }
    next();
});

app.use('/video',router);


app.get('/favicon.ico',(req,res) => {
    res.send(null);
});

app.listen(port,() =>{
    console.log('the server is started on port '+ port +'!');
});

