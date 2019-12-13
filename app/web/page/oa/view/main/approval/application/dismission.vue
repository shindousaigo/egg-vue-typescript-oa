<template>
  <div class="approval dismission">
    <card>
      <span class="line" v-html="process"></span>
      <el-row type="flex">
        <span class="label">*预离职时间：</span>
        <el-date-picker
          style="width: 180px"
          size="mini"
          type="date"
          value-format="yyyy-MM-dd"
          v-model="params.estimatedDepartureDate"
          v-required="params.estimatedDepartureDate"
        ></el-date-picker>
      </el-row>
      <el-row type="flex">
        <span class="label">*离职原因：</span>
        <el-input
          autosize
          type="textarea"
          v-model="params.reason"
          v-required="params.reason"
        ></el-input>
      </el-row>
    </card>
    <card addSubmit>
      <span class="line" v-html="research"></span>
      <div class="questions">
        <div v-for="(item, index) in applicant_topic_list" :key="item.order">
          <el-row type="flex">{{ item.order }}. {{ item.topicContent }}</el-row>
          <el-row type="flex">
            <div
              :style="{
                display: 'flex',
                'align-items': 'center',
                'flex-wrap': 'wrap'
              }"
              v-if="item.topicType === 1"
            >
              <el-radio
                :style="{
                  display: 'flex',
                  'align-items': 'center'
                }"
                v-for="item in item.answerList"
                :key="item.order"
                v-required="params.applicantTopics[index].select"
                v-model="params.applicantTopics[index].select"
                :label="item.order"
                @change="change.call(this, item, params.applicantTopics[index])"
              >
                <span
                  v-if="
                    params.applicantTopics[index].answerType === 2 &&
                      item.answerType === 2
                  "
                >
                  <el-input
                    type="textarea"
                    :placeholder="item.answerContent"
                    size="small"
                    v-required="params.applicantTopics[index].content"
                    v-model="params.applicantTopics[index].content"
                  ></el-input>
                </span>
                <span style="line-height: 28px" v-else>
                  {{ item.answerContent }}
                </span>
              </el-radio>
            </div>
            <div
              :style="{
                display: 'flex',
                'align-items': 'center',
                'flex-wrap': 'wrap'
              }"
              v-if="item.topicType === 2"
            >
              <el-checkbox-group
                v-required="params.applicantTopics[index].select"
                v-model="params.applicantTopics[index].select"
              >
                <el-checkbox
                  :style="{
                    display: 'flex',
                    'align-items': 'center'
                  }"
                  v-for="item in item.answerList"
                  :key="item.order"
                  :label="item.order"
                  @change="
                    change.call(this, item, params.applicantTopics[index])
                  "
                >
                  <span
                    v-if="
                      params.applicantTopics[index].answerType === 2 &&
                        item.answerType === 2
                    "
                  >
                    <el-input
                      type="textarea"
                      :placeholder="item.answerContent"
                      size="small"
                      v-required="params.applicantTopics[index].content"
                      v-model="params.applicantTopics[index].content"
                    ></el-input>
                  </span>
                  <span style="line-height: 28px" v-else>
                    {{ item.answerContent }}
                  </span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <el-row type="flex" v-if="item.topicType === 3" class="full">
              <el-col class="value full">
                <el-input
                  type="textarea"
                  v-required="params.applicantTopics[index].content"
                  v-model="params.applicantTopics[index].content"
                ></el-input>
              </el-col>
            </el-row>
          </el-row>
        </div>
      </div>
    </card>
  </div>
</template>
 
<script lang="ts">
import moment from "moment";
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import ApprovalApplicationBase from "./_approval_application_base";
import { ACTIONS } from "../../../../store/actions/types";
import ApprovalApplicationConfig from "./_approval_application_config";

@Component<Dismission>({
  components: {
    card: require(`./_item/card.vue`).default
  },
  created() {
    this.$dispatch
      .questionnaire_query({
        type: 1
      })
      .then(res => {
        /** 问答 */
        res.applicantTopicList.forEach(item => {
          if (item.topicType === 1) {
            // 单选
            this.params.applicantTopics.push({
              topicId: item.topicId,
              answerType: "",
              select: "",
              content: ""
            });
          } else if (item.topicType === 2) {
            // 多选
            this.params.applicantTopics.push({
              topicId: item.topicId,
              answerType: [],
              select: "",
              content: ""
            });
          } else if (item.topicType === 3) {
            // 问答
            this.params.applicantTopics.push({
              topicId: item.topicId,
              content: ""
            });
          }
        });

        /** 后续补充 */
        res.personnelTopicList.forEach(item => {
          if (item.topicType === 1) {
            // 单选
            this.params.personnelTopics.push({
              topicId: item.topicId,
              answerType: "",
              select: "",
              content: ""
            });
          } else if (item.topicType === 2) {
            // 多选
            this.params.personnelTopics.push({
              topicId: item.topicId,
              answerType: [],
              select: "",
              content: ""
            });
          } else if (item.topicType === 3) {
            // 问答
            this.params.personnelTopics.push({
              topicId: item.topicId,
              content: ""
            });
          }
        });

        this.applicant_topic_list = res.applicantTopicList;
        this.personnel_topic_list = res.personnelTopicList;
        this.params.templateId = res.templateId + "";
      });
  }
})
export default class Dismission extends ApprovalApplicationBase {
  params: ACTIONS.Approval.Application.Params.Dismission;
  process =
    "离职流程：</br>1、提出离职申请，试用期员工提前3天、正式员工提前1个月申请</br>2、离职访谈，人事部会根据所提离职申请，安排时间进行相应的离职访谈</br>3、离职交接，离职当天办理离职交接手续，填写《离职交接表》，人事部出具离职证明。";

  research =
    "成员离职问卷调查：</br>亲爱的成员：非常感谢您在工作的日子里对团队做出的贡献，为您即将离开团队，我们表示深切的遗憾，并送上真挚的祝福。</br>为了使我们对您辞职的真正原因有所了解，从而改进我们的工作，特请您协助填写以下的表格。</br>一切有关您所反馈的信息，仅作为改进工作的依据，希望客观填写以下内容，感谢您的配合！";

  radio = "";
  applicant_topic_list = [];
  personnel_topic_list = [];
  change(item, model) {
    model.answerType = item.answerType;
  }
}
</script>

<style lang="scss">
.approval.dismission {
  font-size: 13px;
  line-height: 24px;
  .line {
    display: flex;
    color: rgba(96, 98, 102, 0.7);
    margin-bottom: 20px;
  }
  .el-row {
    .label {
      width: 102px;
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
