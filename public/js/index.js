/**
 * Created by wangct on 2018/6/3.
 */


$(() => {
    view.init();
})

let view = {
    init(){
        this.getList();
        this.addEvent();
    },
    addEvent(){
        $('#videoList').click(function(e){
            let $li = $(e.target).closest('li');
            if($li.length){
                let src = $(this).data('data')[$li.index()];
                let video = $('#video')[0];
                video.src = '/video/getFile?path=' + encodeURIComponent(src);
                video.play();
            }
        })
    },
    getList(){
        $.ajax({
            url:'/video/getList',
            success:data => {
                this.updateListView(data);
            }
        })
    },
    updateListView(data){
        if(!wt.isArray(data)){
            data = [data];
        }
        let html = '';
        data.forEach((item,i) => {
            let temp = item.split(/\\|\//g);
            let name = temp[temp.length - 1];
            html += '<li title="'+ name +'">'+ name +'</li>';
        });
        $('#videoList').data('data',data).html(html);
    }
};