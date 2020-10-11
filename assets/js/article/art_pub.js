$(function() {
    // 渲染文章分类
    var layer = layui.layer;
    var form = layui.form;

    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 这里必须调用form.render
                form.render();
            }
        })
    }


    // 初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 模拟手动点击选择文件事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });

    // 更换裁剪的图片
    $('#coverFile').on('change', function(e) {
        // 拿到用户选择的文件
        var file = e.target.files[0];
        if (file.length === 0) {
            return layer.msg('请选择图片!');
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 设置状态
    var state = '已发布';

    $('#btnSave2').on('click', function() {
        state = '草稿';
    });

    // 添加文章
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 创建FormData对象,收集数据
        var fd = new FormData(this);

        // 放入状态
        fd.append('state', state);

        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发送ajax要在toBolb()函数里面
                // console.log(...fd);
                // fd.forEach(function(value, key) {
                //     console.log(key, value);
                // })
                // 文章发布
                publishArticle(fd);
            });
    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功 跳转页面
                layer.msg('添加文章成功,跳转中...')
                setTimeout(function() {
                    window.parent.document.querySelector('#art_list').click();
                }, 1500)
            }
        })
    }
})