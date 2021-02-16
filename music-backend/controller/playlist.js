const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')

const callCloudDB = require('../utils/callCloudDB')

router.get('/list', async(ctx,next) => {
    const query = ctx.request.query
    const res = await callCloudFn(ctx,'music',{
        $url:'playlist',
        start:parseInt(query.start),
        count:parseInt(query.count),
    })
    let data = []
    if(res.resp_data){
        data = JSON.parse(res.resp_data).data
    }
    ctx.body = {
        data,
        code:20000,
    }
})

//根据id查询歌单详情，通过封装的操作云数据库的函数实现，注意传的id需时数据库唯一的_id
router.get('/detail', async(ctx, next) => {
    console.log(ctx.request.query.id)
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: JSON.parse(res.data),
    }
})

//更新歌单（名称和描述），传参为请求体JSON对象
router.post('/update', async(ctx, next) => {
    const params = ctx.request.body
    const query = `db.collection('playlist').doc('${params._id}').update({
            data: {
                name: '${params.name}',
                description: '${params.description}'
            }
        })`
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    ctx.body = {
        code: 20000,
        data: res,
    }
})

//删除歌单
router.post('/delete', async(ctx, next) => {
    const params = ctx.request.query
    const query = `db.collection('playlist').doc('${params.id}').remove()`
    const res = await callCloudDB(ctx, 'databasedelete', query)
    ctx.body = {
        code: 20000,
        data: res,
    }
})

module.exports = router