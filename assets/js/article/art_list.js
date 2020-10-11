$(function() {
    // 为 art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function(dtStr) {
        var dt = new Date(dtStr);

        var y = dt.getFullYear();
        var m = PadZero(dt.getMonth() + 1);
        var d = PadZero(dt.getDate());

        var hh = PadZero(dt.getHours());
        var mm = PadZero(dt.getMinutes());
        var ss = PadZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;


    };
    // 个位数补0
    function PadZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象,将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每个页面显示几条数据,默认是2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 初始化文章列表
    initTable();

    // 封装
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                var str = template('tpl-table', res);
                $('tbody').html(str);
                // 渲染文章列表同时,渲染分页
                renderPage(res.total);
            }
        })
    }

    // 初始化分类
    var form = layui.form; // 导入form
    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值,渲染form
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();

        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();
    });


    // 封装渲染分页的方法
    var laypage = layui.laypage;

    function renderPage(total) {
        laypage.render({
            // 执行一个laypage实例
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum, // 第几页

            // 分页模块设置,显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页条数的选择项

            // 触发jump: 分页初始化的时候(调用laypage.render()方法),页面改变的时候(点击页码)
            jump: function(obj, first) {
                // obj: 所有参数所在对象  first: 是否是第一次初始化分页
                // 可以通过first值来判断是哪种方式触发的jump回调
                // 如果first的值为true,证明是方式1
                // console.log(first, obj.curr);
                // 把最新的页码值,赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数,赋值到q这个查询参数对象的pagesize 属性中
                q.pagesize = obj.limit;
                if (!first) {
                    // 初始化文章列表
                    initTable();
                }
            }
        });
    }

    // 删除
    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function() {
        // 先获取Id,进入到函数中this代指就改变了
        var Id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!');
                    }
                    layer.msg('删除文章成功!');
                    // 删除按钮个数等于1,页码大于1,可以继续删除
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        });

    })
})