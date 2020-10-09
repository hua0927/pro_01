$(function() {
    // 自定义校验规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 新旧密码不能重复
        samePwd: function(value) {
            // value是新密码,旧密码需要获取
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能相同! ';
            }
        },
        // 两次新密码必须相同
        rePwd: function(value) {
            // value是再次输入的新密码,新密码需要重新获取
            if (value !== $('[name=newPwd]').val()) {
                return '两次新密码输入不一致! ';
            }
        }
    });

    // 表单提交
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('修改密码成功!');
                $('.layui-form')[0].reset();
            }
        })
    })
})