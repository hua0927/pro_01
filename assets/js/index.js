$(function() {
    // 获取用户信息
    getUserInfo();

    // 退出
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        // 框架提供的询问框
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 删除本地token
            localStorage.removeItem('token');
            // 跳转页面
            location.href = '/login.html';
            // layui的关闭询问框
            layer.close(index);
        });
    })
});

// 获取用户信息,后面其他页面也需要使用,所以需要是全局变量,如果在入口函数中,则是局部变量
function getUserInfo() {
    // 发送ajax
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        // token 过12小时会失效
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!');
            }
            // 渲染用户头像
            renderAvatar(res.data);
        },
        // 无论成功或者失败都会触发complete方法
        // complete: function(res) {
        //     console.log(res);
        //     // 判断,如果身份认证失败,跳转回登录页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 强制删除本地token
        //         localStorage.removeItem('token');
        //         // 强制跳转页面
        //         location.href = '/login.html';
        //     }
        // }

    });
}

// 渲染用户
function renderAvatar(user) {
    // 获取用户名
    var name = user.nickname || user.username;
    // 渲染用户名
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    // 用户头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        // 没头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }
}