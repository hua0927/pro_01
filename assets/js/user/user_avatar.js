$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 选择文件
    $('#btnChooseImage').on('click', function() {
        // 模拟手动点击选择文件按钮
        $('#file').click();
    });


    // 修改图片
    var layer = layui.layer;
    $('#file').on('change', function(e) {
        // 拿到用户选择的文件
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择用户头像!');
        }
        // 获取成功,修改图片
        var file = e.target.files[0];
        // 根据选择的文件,创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file);
        // 先销毁旧的裁剪区域,再重新设置图片路径,再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 确定修改
    $('#btnUpload').on('click', function() {
        // 获取base64 类型的头像(字符串)
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('上传用户头像失败!');
                }
                layer.msg('用户头像上传成功!');
                // 更新父页面上的用户头像信息
                window.parent.getUserInfo();
            }
        });
    });

    // 修改头像的默认值
    getUserInfo();

    function getUserInfo() {
        // 发送ajax
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败!');
                }
                // 渲染用户头像
                // 先销毁旧的裁剪区域,再重新设置图片路径,再创建新的裁剪区域
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', res.data.user_pic) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            },

        });
    }
})