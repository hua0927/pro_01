$(function() {
    initArtCateList();
    // 初始化文章分类列表
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 显示添加文章分类列表
    var layer = layui.layer;
    var indexAdd = null;
    $('#btnAdd').on('click', function() {
        // 利用框架代码,显示提示添加文章类别区域
        indexAdd = layer.open({
            // type为1,确定按钮消失
            type: 1,
            title: '添加文章分类',
            // area - 宽高 默认：'auto'
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    });

    // 提交文章分类添加(事件代理)
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 因为添加成功,需要重新渲染页面
                initArtCateList();
                layer.msg('文章类别添加成功!');
                layer.close(indexAdd);
            }
        });
    });
    // 修改文章分类(事件代理)
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function(e) {
        // 利用框架代码,显示提示添加文章类别区域
        indexEdit = layer.open({
            // type为1,确定按钮消失
            type: 1,
            title: '修改文章分类',
            // area - 宽高 默认：'auto'
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        // 获取Id,发送ajax 获取数据,渲染到页面
        var Id = $(this).attr('data-id');
        var form = layui.form;
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        });
    });

    // 修改 - 提交
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 更新成功 重新渲染页面中的数据
                initArtCateList();
                layer.msg('文章类别更新成功!');
                layer.close(indexEdit);
            }
        });
    });

    // 删除
    $('tbody').on('click', '.btn-delete', function() {
        // 获取id
        var Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something

            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 成功 重新渲染页面
                    layer.msg('文章类别删除成功!');
                    layer.close(index);
                    initArtCateList();
                }
            })


        });
    })
})