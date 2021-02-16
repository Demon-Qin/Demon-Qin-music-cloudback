//引入异步请求库
const rp = require('request-promise')
const APPID= 'wx1f8d14f29de05901'
const APPSECRET = 'aa7354459272bd9e1b77e99c740c7e8c'
//请求access——token的URL
//请求access_token的url
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
//引入node.js的文件操作模块（自带）
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')

const updateAccessToken = async () => {
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)
    console.log(res)
    if(res.access_token){
        fs.writeFileSync(
            fileName,
            JSON.stringify({
                access_token:res.access_token,
                createTime: new Date(),
            })
        )
    }else{
        await updateAccessToken()
    }
}

const getAccessToken = async () =>{
    try {
        const readRes = fs.readFileSync(fileName, 'utf8')
        const readObj = JSON.parse(readRes)
        const createTime = new Date(readObj.createTime).getTime()
        const nowTime = new Date().getTime()
        if((nowTime - createTime) / 1000 / 60 /60 >= 2){
            await updateAccessToken()
            await getAccessToken()
        }
        return readObj.access_token
    }catch (error){
        await updateAccessToken()
        await getAccessToken()
    }
}

setInterval(async () => {
    await updateAccessToken()
},(7200 - 300) * 1000)

updateAccessToken()

module.exports = getAccessToken