import { Context, Service } from 'egg';
import axios, { AxiosInstance } from 'axios'
import { RgServerBaseUrl } from "../web/page/oa/const_oa";
import { ACTIONS } from "web/page/oa/store/actions/types";
import Actions, { ActionsMethods } from "web/page/oa/store/actions";

type Implements = {
  [key in keyof Actions[ActionsMethods]]: any
}

export default class OaService extends Service implements Implements {
  public qyAxios: AxiosInstance = axios.create({ baseURL: 'https://qyapi.weixin.qq.com' })
  public rgAxios: AxiosInstance = axios.create({ baseURL: RgServerBaseUrl })

  public corpid = 'wwc5265d7ecd0d5d29'
  public corpsecret = 'u94cJhsUwmQQemcuhqRG2o1KMKPc9biHew3o1WIePAg'
  public agentid = '1000014'
  public host = 'http://www.shindousaigo.com:9000'

  constructor(ctx: Context) {
    super(ctx);
    this.qyAxios.interceptors.response.use(function (config) {
      return config.data
    })
    this.rgAxios.interceptors.response.use(function (config) {
      if (config.data.code === 200) {
        return config.data.data || config.data.message
      } else {
        return Promise.reject(config.data);
      }
    })
    this.rgAxios.interceptors.request.use(function (config) {
      if (config.data) {
        config.data = Object.keys(config.data).map(key => `${key}=${config.data[key]}`).join(`&`)
      }
      return config;
    }, function (error) {
      return Promise.reject(error);
    })
  }

  public async access_token_query() {
    const data: {
      errcode: number
      errmsg: string
      access_token: string
      expires_in: number
    } = await this.qyAxios.get("/cgi-bin/gettoken", {
      params: {
        corpid: this.corpid,
        corpsecret: this.corpsecret,
      }
    })
    const update_sql = JSON.stringify({
      query: `mutation {  oa_access_token( data: { corpid: "${this.corpid}", corpsecret: "${this.corpsecret}", access_token: "${data.access_token}" } ) }`
    })
    this.ctx.graphql.query(update_sql)
    return data.access_token
  }

  public async access_token() {
    const graphql_name = 'oa_access_token'
    const expires_times = 7200000
    let data: {
      data: { [graphql_name]: any },
      errors: any
    }
    const query_sql = JSON.stringify({
      query: `query { ${graphql_name} (corpid: "${this.corpid}") }`
    })
    return new Promise(async (resolve) => {
      data = await this.ctx.graphql.query(query_sql)
      if (data.errors) {
        resolve(await this.access_token_query())
      } else {
        const delta = Date.now() - new Date(data.data[graphql_name].updatedAt).getTime()
        if (delta > expires_times) {
          resolve(await this.access_token_query())
        }
      }
      resolve(data.data[graphql_name].access_token)
    })
  }

  public async userid(code: string) {
    return new Promise(async (resolve) => {
      const access_token = await this.access_token()
      const data: {
        errcode: number
        errmsg: string
        UserId: string
        DeviceId: string
      } = await this.qyAxios.get("/cgi-bin/user/getuserinfo", {
        params: { code, access_token }
      })
      resolve(data.UserId)
    })
  }

  public async department_list(id?: string) {
    return new Promise(async (resolve) => {
      const access_token = await this.access_token()
      const data: {
        errcode: number
        errmsg: string
        department: {
          id: number,
          name: string,
          parentid: number,
          order: number
        }[]
      } = await this.qyAxios.get("/cgi-bin/department/list", {
        params: (id ? { id, access_token, } : { access_token }) as {
          access_token: string
          // 部门id。获取指定部门及其下的子部门。 如果不填，默认获取全量组织架构
          id?: string
        }
      })
      resolve(data.department.filter(department => department.id !== 1487015695))
    })
  }

  public async user_permission(ctx: Context) {
    try {
      const params: ACTIONS.User.Permission.Params = JSON.parse(ctx.request.rawBody)
      const data: { roleInfo: ACTIONS.User.Permission.State } = await this.rgAxios.post("/user/userPermission", {
        userId: params.userid
      })
      return data.roleInfo
    } catch (error) {
      return error.message
    }
  }

  public async user_list(ctx: Context) {
    return new Promise(async (resolve) => {
      const access_token = await this.access_token()
      const { department_id, fetch_child, type } = JSON.parse(ctx.request.rawBody)
      const data: {
        errcode: number
        errmsg: string
        userlist: ACTIONS.User.List.State
      } = await this.qyAxios.get(`/cgi-bin/user/${type}`, {
        params: {
          access_token,
          department_id,
          fetch_child
        }
      })
      resolve(data.userlist.filter(user => !user.department.includes(1487015695)))
    })
  }

  public async user_info(ctx: Context) {
    try {
      const params: ACTIONS.User.Info.Params = JSON.parse(ctx.request.rawBody)
      const data: { userInfo: ACTIONS.User.Info.State } = await this.rgAxios.post("/user/userInfo", {
        userId: params.userid
      })
      return data.userInfo
    } catch (error) {
      return error.message
    }
  }

  public async user_overtime_detail(ctx: Context) {
    try {
      const params: ACTIONS.User.Overtime.Detail.Params = JSON.parse(ctx.request.rawBody)
      const data: ACTIONS.User.Overtime.Detail.State = await this.rgAxios.post("/leave/overtimeDetailInfo", {
        userId: params.userid
      })
      return { overtime_detail_info: data }
    } catch (error) {
      return error.message
    }
  }

  public async user_annual_leave_detail(ctx: Context) {
    try {
      const params: ACTIONS.User.AnnualLeave.Detail.Params = JSON.parse(ctx.request.rawBody)
      const data: ACTIONS.User.AnnualLeave.Detail.State = await this.rgAxios.post("/leave/annualLeaveDetailInfo", {
        userId: params.userid
      })
      return { annual_leave_detail_info: data }
    } catch (error) {
      return error.message
    }
  }

  public async user_approval_list(ctx: Context) {
    try {
      const params: ACTIONS.User.Approval.List.Params = JSON.parse(ctx.request.rawBody)
      const data: { approvalInfo: ACTIONS.User.Approval.List.State } = await this.rgAxios.post("/approval/approvalAllInfo", {
        userId: params.userid
      })
      return data.approvalInfo
    } catch (error) {
      return error.message
    }
  }

  public async user_approval_check_in_record(ctx: Context) {
    try {
      const params: ACTIONS.User.Approval.CheckInRecord.Params = JSON.parse(ctx.request.rawBody)
      const data: ACTIONS.User.Approval.CheckInRecord.State = await this.rgAxios.post("/approval/checkInRecord", {
        startTime: params.startTime,
        endTime: params.endTime,
        userId: params.userid
      })
      return data
    } catch (error) {
      return error.message
    }
  }

  public async leave_info(ctx: Context) {
    try {
      const params: ACTIONS.Leave.Info.Params = JSON.parse(ctx.request.rawBody)
      const data: ACTIONS.Leave.Info.State = await this.rgAxios.post("/leave/leaveInfoList", {
        userIds: params.userIds
      })
      return data
    } catch (error) {
      return error.message
    }
  }

  public async leave_type_list(ctx: Context) {
    try {
      const data: { LeaveTypeList: ACTIONS.Leave.Type.List.State } = await this.rgAxios.get("/leave/allType")
      return data.LeaveTypeList
    } catch (error) {
      return error.message
    }
  }

  public async attendance_page_record(ctx: Context) {
    try {
      const params: ACTIONS.Attendance.PageRecord.Params = JSON.parse(ctx.request.rawBody)
      const data: { AttendanceInfo: ACTIONS.Attendance.PageRecord.State } = await this.rgAxios.post("/attendance/pageRecord", {
        userId: params.userid,
        startTime: params.startTime,
        endTime: params.endTime
      })
      return data.AttendanceInfo
    } catch (error) {
      return error.message
    }
  }

  public async attendance_punch_record(ctx: Context) {
    try {
      const params: ACTIONS.Attendance.PunchRecord.Params = JSON.parse(ctx.request.rawBody)
      const data: { punchRecordList: ACTIONS.Attendance.PunchRecord.State } = await this.rgAxios.post("/attendance/queryPunchRecord", {
        userId: params.userid,
        date: params.date,
      })
      return data.punchRecordList
    } catch (error) {
      return error.message
    }
  }

  public async approval_list(ctx: Context) {
    try {
      const params: ACTIONS.Approval.List.Params = JSON.parse(ctx.request.rawBody)
      const data: { approvalDetailInfo: ACTIONS.Approval.List.State } = await this.rgAxios.post("/approval/approvalDetailInfo", {
        serialNumber: params.serialNumber
      })
      return data.approvalDetailInfo
    } catch (error) {
      return error.message
    }
  }

  public async approval_application(ctx: Context) {
    try {
      const params: ACTIONS.Approval.Application.Params = JSON.parse(ctx.request.rawBody)
      const data: ACTIONS.Approval.Application.State = await this.rgAxios.post("/approval/application", params)
      return data
    } catch (error) {
      return error.message
    }
  }

  public async approval_application_detail(ctx: Context) {
    try {
      const params: ACTIONS.Approval.Application.Detail.Params = JSON.parse(ctx.request.rawBody)
      const data: { applicationDetailInfo: ACTIONS.Approval.Application.Detail.State } = await this.rgAxios.post("/approval/applicationDetailInfo", {
        serialNumber: params.serialNumber
      })
      return data.applicationDetailInfo
    } catch (error) {
      return error.message
    }
  }

  public async approval_application_delete(ctx: Context) {
    try {
      const params: ACTIONS.Approval.Application.Delete.Params = JSON.parse(ctx.request.rawBody)
      const data: ACTIONS.Approval.Application.Delete.State = await this.rgAxios.post("/approval/deleteApplication", {
        serialNumber: params.serialNumber,
      })
      return data
    } catch (error) {
      return error.message
    }
  }

}
