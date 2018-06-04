/**
 * Created by Administrator on 2018/6/4.
 */
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const filePath = resolveDir('../public/video/1.WMV');

const outPath = resolveDir('a.mp4');

ffmpeg(filePath).format('mp4').output(outPath).on('end',(err,data) => {
    console.log(err);
    console.log(111);
    console.log(data);
}).run();



function resolveDir(){
    return path.resolve(__dirname,...arguments);
}