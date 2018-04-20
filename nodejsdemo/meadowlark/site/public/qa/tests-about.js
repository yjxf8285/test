/**
 * Created by 刘晓帆 on 2016-4-11.
 */
suite('About page test',function(){
    test('page should contain link to contact page',function(){
        assert($('a[href="/contact"]').length);//如果页面没有这个链接就会报错
    })
});