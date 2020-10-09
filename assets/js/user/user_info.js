$(function() {
    // 自定义校验规则
    var form = layui.form;

    form.verify({
        // 用户昵称
        nickname: [
            /^[\S]{1,6}$/,
            "昵称长度必须在 1 ~ 6 个字符之间"
        ]
    });

    // 初始化用户信息
    initUserInfo();

    // 初始化用户信息封装,后面还要用
    var layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功后渲染
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 表单重置
    $('#reset').on('click', function(e) {
        // 阻止重置
        e.preventDefault();
        // 重新用户渲染
        initUserInfo();
    });

    // 修改用户信息
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg('修改用户信息成功!');
                // 调用父框架的全局方法
                window.parent.getUserInfo();
            }
        })
    })
})