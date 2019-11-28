import { Controller, Context } from 'egg'
import OaService from "app/service/oa"

export default class Oa extends Controller {

  public async index(ctx: Context) {
    const userid = ctx.cookies.get('userid')
    const renderClient = function (userid: string) {
      ctx.renderClient(
        'oa/index.js',
        {
          url: ctx.url.replace(/\/oa/, ''),
          userid,
        },
      )
    }
    if (userid) {
      renderClient(userid)
    } else {
      const code = ctx.query.code
      if (code) {
        const userid = await ctx.service.oa.userid(code)
        ctx.cookies.set('userid', userid)
        renderClient(userid)
      } else {
        ctx.redirect(`https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${ctx.service.oa.corpid}&agentid=${ctx.service.oa.agentid}&redirect_uri=${ctx.service.oa.host}/oa&state=state`)
      }
    }
  }

  public async action(ctx: Context) {
    const OaService: OaService = this.service.oa
    const action = ctx.params[0].replace(/\/|\\/, '')
    try {
      ctx.body = JSON.stringify(await OaService[action](ctx))
    } catch (error) {
      this.logger.error(error)
    }
  }

} 