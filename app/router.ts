
import { Application } from 'egg';
// const mm = require('egg-mock');
// const app = mm.app();
const koaBody = require('koa-body');

export default (application: Application) => {
  const { router, controller } = application;

  // router.post('/admin/api/article/list', controller.admin.list);
  // router.post('/admin/api/article/add', controller.admin.add);
  // router.post('/admin/api/article/del', controller.admin.del);
  // router.get('/admin/api/article/:id', controller.admin.detail);

  router.post('/oa/action/approval_application', koaBody({ multipart: true }), controller.oa.action);
  router.post('/oa/action/*', controller.oa.action);
  router.get('/oa', controller.oa.index);
  router.get('/oa/*', controller.oa.index);

  router.get('/*', controller.admin.home);

};