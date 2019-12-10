<template>
  <div class="approval leave">
    <card addSubmit>
      <el-row type="flex">
        <span class="label">*休假类别：</span>
        <el-select
          style="width: 125px"
          size="mini"
          filterable
          clearable
          v-model="params.leaveType"
          v-required="params.leaveType"
          @change="params.childrenType = ``"
        >
          <el-option
            v-for="option in leave_type_dictionary"
            :key="option.id"
            :value="option.id"
            :label="option.leaveName"
          ></el-option>
        </el-select>
        <el-select
          style="width: 160px; margin: 0 0 0 16px;"
          size="mini"
          filterable
          clearable
          v-if="
            leave_type_dictionary &&
              params.leaveType &&
              leave_type_dictionary[params.leaveType].children
          "
          v-model="params.childrenType"
          v-required="params.childrenType"
        >
          <el-option
            v-for="option in leave_type_dictionary[params.leaveType].children"
            :key="option.id"
            :value="option.id"
            :label="option.leaveName"
          ></el-option>
        </el-select>
      </el-row>
      <el-row
        v-if="condition[params.leaveType] && condition[params.leaveType].desc"
        style="margin: -8px 0 0 16px; color: rgba(96,98,102,0.7);"
      >
        <span class="label" v-html="condition[params.leaveType].desc"></span>
      </el-row>
      <el-row type="flex">
        <span class="label">*休假时段：</span>
        <el-date-picker
          size="mini"
          type="date"
          style="margin: 0 16px 0 0; width: 130px;"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          v-model="date1"
          v-required="date1"
        >
        </el-date-picker>
        <el-select
          size="mini"
          v-model="period1"
          v-required="period1"
          style="width: 86px;"
        >
          <el-option
            v-for="i in periodOptions"
            :key="i.value"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
        <span style="padding: 0 16px;">至</span>
        <el-date-picker
          size="mini"
          type="date"
          style="margin: 0 16px 0 0; width: 130px;"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          v-model="date2"
          v-required="date2"
        >
        </el-date-picker>
        <el-select
          size="mini"
          v-model="period2"
          v-required="period2"
          style="width: 86px;"
        >
          <el-option
            v-for="i in periodOptions"
            :key="i.value"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-row>
      <el-row
        v-if="this.params.duration"
        style="margin: -8px 0 0 16px; color: rgba(96,98,102,0.7);"
      >
        <span
          v-if="validator.isValid"
          class="label"
          :class="validator.className"
        >
          时段时效： {{ $hours(this.params.duration) }}
        </span>
        <span v-else class="label" :class="validator.className">
          {{ validator.message }}，当前时效为：{{
            $hours(this.params.duration)
          }}
        </span>
      </el-row>
    </card>
  </div>
</template>
 
<script lang="ts">
import moment from "moment";
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import DashboardUserinfoBase from "../../dashboard/userinfo/_dashboard_userinfo_base";
import ApprovalApplicationBase from "./_approval_application_base";
import { ACTIONS } from "../../../../store/actions/types";
const BaseMix = ApprovalApplicationBase.extend(DashboardUserinfoBase);

@Component<Leave>({
  components: {
    card: require(`./_item/card.vue`).default
  }
})
export default class Leave extends BaseMix {
  constructor(props) {
    super(props);
    /** overwrite */
    this.submit = (submit => {
      return async () => {
        this.beforeSubmit();
        return;
        submit();
      };
    })(this.submit);
  }
  submit: ApprovalApplicationBase["submit"];
  period: ApprovalApplicationBase["period"];
  periodOptions: ApprovalApplicationBase["period"]["options"] = (period => {
    return period.options.filter(
      option => option.value >= 9.5 && option.value <= 18.5
    );
  })(this.period);
  params: ACTIONS.Approval.Application.Params.Leave;
  overtimeAvailable: DashboardUserinfoBase["overtimeAvailable"];
  annualLeaveAvailable: DashboardUserinfoBase["annualLeaveAvailable"];
  date1: string = "";
  @Watch("date1")
  onDate1Change(value) {
    this.dateCheck();
  }
  period1: string = "";
  @Watch("period1")
  onPeriod1Change(value) {
    this.periodCheck();
  }
  date2: string = "";
  @Watch("date2")
  onDate2Change(value) {
    this.dateCheck();
  }
  period2: string = "";
  @Watch("period2")
  onPeriod2Change(value) {
    this.periodCheck();
  }
  dateCheck() {
    if (this.date1 && this.date2) {
      if (new Date(this.date1) > new Date(this.date2)) {
        this.date2 = "";
      }
    }
    this.periodCheck();
  }
  periodCheck() {
    if (this.date1 && this.date2 && this.period1 && this.period2) {
      if (
        new Date(this.date1 + " " + this.period.map[this.period1]) >=
        new Date(this.date2 + " " + this.period.map[this.period2])
      ) {
        this.period2 = "";
      } else {
        this.durationHandler();
      }
    } else {
      this.params.duration = 0;
    }
  }

  beforeSubmit() {
    if (!this.validator.isValid) {
      this.$notify.error(this.validator.message);
      return;
    }
    this.params.startTime =
      this.date1 + " " + this.period.map[this.period1] + ":00";
    this.params.endTime =
      this.date2 + " " + this.period.map[this.period2] + ":00";
  }

  durationHandler() {
    const period1 = Number(this.period1),
      period2 = Number(this.period2);
    if (this.date1 === this.date2) {
      this.params.duration =
        period2 - period1 + (period1 <= 12.5 && period2 > 12.5 ? -1.5 : 0);
    } else {
      const $moment = moment(this.date1);
      for (let i = 0; i < Infinity; i++) {
        if (!i) {
          this.params.duration = Math.min(
            18.5 - period1 + (period1 <= 12.5 ? -1.5 : 0),
            7.5
          );
        } else {
          this.params.duration += 7.5;
        }
        $moment.add(1, "day");
        if ($moment.format("YYYY-MM-DD") === this.date2) {
          this.params.duration += Math.min(
            period2 <= 12.5 ? period2 - 9.5 : 12.5 - 9.5 + period2 - 14,
            7.5
          );
          break;
        }
      }
    }
    if (!this.params.duration) {
      this.period2 = "";
    }
  }

  get conditionItem() {
    if (this.leave_type_dictionary && this.params.leaveType) {
      if (this.leave_type_dictionary[this.params.leaveType].children) {
        return this.condition[this.params.leaveType];
      } else {
        return this.condition[this.params.leaveType];
      }
    }
  }

  get condition() {
    return {
      /** 调休 */ "1": {
        duration: this.overtimeAvailable,
        warn: `可用调休最多 $1 `,
        desc: "可用调休：" + this.$hours(this.overtimeAvailable)
      },
      /** 年假 */ "2": {
        duration: this.annualLeaveAvailable,
        warn: `可用年假最多 $1 `,
        desc: "可用年假：" + this.$hours(this.annualLeaveAvailable)
      },
      /** 事假 */ "3": {
        duration: Infinity,
        desc: ""
      },
      /** 病假 */ "4": {
        duration: Infinity,
        desc:
          "备注： 请休病假需提供区级以上医院的有效医疗处方证明或开具的病假证明至人事行政部备案。身体是革命的本钱，请照顾好自己哦~"
      },
      /** 婚假 */ "5": {
        duration: 3 * 7.5,
        warn: `可用婚假最多 $1 （含公休日、节假日）`,
        desc:
          "假期时长限制：最多3天（含公休日、节假日）<br /> 备注：婚假属于自然日类别假期，需在正式注册登记日起一年内一次性休完，同时成员在提出休假申请时需要提供结婚证明至人事行政部备案。恭喜您与心爱的另一半喜结良缘，祝愿白头偕老、举案齐眉。"
      },
      /** 护理假 */ "6": {
        duration: 15 * 7.5,
        warn: `可用护理假最多 $1 （含公休日、节假日）`,
        desc:
          "假期时长限制：最多15天（含公休日、节假日）<br />备注：护理假属于自然日类别假期，休假完成后请提交宝贝的出生证明至人事行政部备案。恭喜您荣升为一名父亲，护理假需在宝贝出生的一年以内一次性休完哦~"
      },
      /** 产假 */ "7": {
        duration: 178 * 7.5,
        warn: `可用产假最多 $1 （含公休日、节假日）`,
        desc:
          "假期时长限制：可用178天（含公休日、节假日）<br />备注：如难产或者生育多胞胎的，请联系人事行政部为您增加假期。<br />产假属于自然日类别假期，休假完成后请提交医疗部门开具的相关医学证明（如宝宝的出生证明）至人事行政部备案。恭喜您即将收获属于您的那份快乐，请休养好身体，祝愿宝宝健康快乐成长。"
      },
      /** 丧假 */ "8": {
        duration: 3 * 7.5,
        warn: `可用丧假最多 $1 （含公休日、节假日）`,
        desc:
          "假期时长限制：最多3天（含公休日、节假日）<br />备注：成员直系亲属（包括父母、岳父母、配偶、子女、祖父母、外祖父母）去世，享有全薪丧假3天（含公休日、节假日），丧假属于自然日类别假期。获悉您家中有至亲离世，我们深感沉痛，请您和您的家人节哀，亲人离世一个月内，丧假需一次性请休。"
      },
      /** 计划生育假 */ "9": {
        params: this.params,
        name: {
          label: `计划生育假`,
          children: {
            /** 绝育 */ "11": "绝育",
            /** 节育 */ "12": "节育",
            /** 普通流产 */ "13": "普通流产",
            /** 怀孕不满四个月流产 */ "14": "怀孕不满四个月流产",
            /** 怀孕满四个月流产 */ "15": "怀孕满四个月流产"
          }
        },
        get duration() {
          return {
            /** 绝育 */ "11": 3 * 7.5,
            /** 节育 */ "12": 3 * 7.5,
            /** 普通流产 */ "13": 12 * 7.5,
            /** 怀孕不满四个月流产 */ "14": 15 * 7.5,
            /** 怀孕满四个月流产 */ "15": 42 * 7.5
          }[this.params.childrenType];
        },
        get warn() {
          return `可用${this.name.label}（${
            this.name.children[this.params.childrenType]
          }）最多 $1 （含公休日、节假日）`;
        },
        desc:
          "假期时长限制：<br />①绝育：最多3天<br />②节育：最多3天<br />③普通流产：最多12天<br />④怀孕不满4个月流产：最多15天<br />⑤怀孕满4个月流产：最多42天<br />备注：成员本人按计划生育规定做绝育及节育手术的可享受3天带薪假期；已婚女成员可以享受一次为期12天的带薪人工流产假，第二次及以后的流产假按病假处理；怀孕不满四个月流产休假时间为15天；怀孕满四个月流产休假时间为42天。<br />计划生育假属于自然日类别假期，休假完成后请提交医疗部门开具的相关休假证明至人事行政部备案。"
      },
      /** 孕期检查假 */ "10": {
        duration: 4.5,
        warn: `可用孕期检查假最多 $1 （含公休日、节假日）`,
        desc:
          "假期时长限制：最多0.5天（小于或等于4.5小时算0.5天）<br />备注：女员工怀孕期间，可按医疗部门的建议按期进行孕期检查，享受每月1次往返时间不超0.5天的检查假。恭喜您荣升为母亲，在怀孕期间是每个女人一辈子最幸福的时刻，请您照顾好自己和您肚子里的小宝宝。"
      }
    };
  }

  get leave_type_dictionary() {
    return this.$getters.leave_type_dictionary;
  }

  get validator() {
    const data = {
      isValid: true,
      className: "valid",
      message: ""
    };
    if (
      this.params.duration &&
      this.conditionItem &&
      this.conditionItem.duration
    ) {
      if (this.params.duration > this.conditionItem.duration) {
        data.isValid = false;
        data.className = "invalid";
        data.message = this.conditionItem.warn.replace(
          "$1",
          this.$hours(this.conditionItem.duration)
        );
      }
    }
    return data;
  }
}
</script>

<style lang="scss">
.approval.leave {
  .el-row {
    .label {
      width: 102px;
      &.invalid {
        color: red;
      }
    }
    margin: 14px 0;
    line-height: 26px;
    font-size: 13px;
    textarea {
      min-height: 56px !important;
    }
  }
}
</style>
