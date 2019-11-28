// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArtilcedetail = require('../../../app/model/artilcedetail');
import ExportItem = require('../../../app/model/item');
import ExportOaAccessToken = require('../../../app/model/oa_access_token');
import ExportOaUser = require('../../../app/model/oa_user');
import ExportTag = require('../../../app/model/tag');
import ExportUser = require('../../../app/model/user');
import ExportUtilsBase = require('../../../app/model/utils/base');

declare module 'egg' {
  interface IModel {
    Artilcedetail: ReturnType<typeof ExportArtilcedetail>;
    Item: ReturnType<typeof ExportItem>;
    OaAccessToken: ReturnType<typeof ExportOaAccessToken>;
    OaUser: ReturnType<typeof ExportOaUser>;
    Tag: ReturnType<typeof ExportTag>;
    User: ReturnType<typeof ExportUser>;
    Utils: {
      Base: ReturnType<typeof ExportUtilsBase>;
    }
  }
}
