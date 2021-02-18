const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const ENV = 'zyqin-8gjt4wj432d7f602'

//全局中间件，ctx.body即向客户端的返回内容
app.use(
    cors({
        origin:['http://localhost:9528'],
        credentials:true,
    })
)
app.use(
    koaBody({
        multipart:true,
    })
)

//配置云环境
app.use(async (ctx, next) => {
    ctx.state.env = ENV
    //ctx.body = "Hello World"
    await next()
})

//通过require引入student模块
const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')

//给student模块使用定义根路由为'/student'
router.use('/playlist', playlist.routes())
router.use('/swiper',swiper.routes())
router.use('/blog', blog.routes())

//使用路由
app.use(router.routes())
app.use(router.allowedMethods())

//对3000端口开启监听，这是node.js的默认端口
app.listen(3000,() => {
    console.log('服务开启在3000端口')
})