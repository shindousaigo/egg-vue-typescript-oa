// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccess from '../../../app/middleware/access';
import ExportGlobal from '../../../app/middleware/global';
import ExportGzip from '../../../app/middleware/gzip';

declare module 'egg' {
  interface IMiddleware {
    access: typeof ExportAccess;
    global: typeof ExportGlobal;
    gzip: typeof ExportGzip;
  }
}
