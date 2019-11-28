// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdmin from '../../../app/controller/admin';
import ExportOa from '../../../app/controller/oa';

declare module 'egg' {
  interface IController {
    admin: ExportAdmin;
    oa: ExportOa;
  }
}
