/**
 * Created by wangct on 2018/6/3.
 */
const fs = require('fs');
const path = require('path');
const outPath = path.resolve(__dirname,'..','json/videoList.json');
const excludePaths = ['node_modules'];
const filterPaths = ['.mp4','.mov','.rmvb','.wmv','.avi','.rm','.mpeg1－4','.mtv','.dat','.3gp','.amv','.dmv','.flv','.mkv'];

const getVideoPath = (dir,filterPaths,excludePaths) => {
    let stat;
    try{
        stat = fs.statSync(dir);
    }catch(e){
        return [];
    }
    if(stat.isDirectory()){
        let data = fs.readdirSync(dir);
        return data.filter(item => excludePaths.every(excludeItem => item.indexOf(excludeItem) === -1)).map(item => getVideoPath(path.join(dir,item),filterPaths,excludePaths)).reduce((pv,item) => {
            return pv.concat(item);
        },[]);
    }else if(filterPaths.some(item => new RegExp(item + '$').test(dir))){
        return dir;
    }else{
        return [];
    }
};

let result = getVideoPath(dir,filterPaths,excludePaths);

fs.writeFile(outPath,JSON.stringify(result),(err,data) => {
    if(err){
        console.log(err);
    }else{
        console.log('success');
    }
});