/**
 * Created by 刘晓帆 on 2016-4-11.
 */
suite('Global Tests', function () {
    test('page has a valid title', function () {
        assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');//网站标题如果是TODO就会报错
    });
});