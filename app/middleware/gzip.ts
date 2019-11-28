import { Context } from 'egg';
const isJson = require('koa-is-json')
const zlib = require('zlib')
export default () => {
  return async function global(ctx: Context, next: any) {
    await next()
    // 后续中间件执行完成后将响应体转换成 gzip
    let body = ctx.body
    if (!body) return
    if (isJson(body)) body = JSON.stringify(body)
    // 设置 gzip body，修正响应头
    const stream = zlib.createGzip();
    stream.end(body);
    ctx.body = stream;
    ctx.set('Content-Encoding', 'gzip');
  };
};