<template>
  <div class="user-edit">
    <ElRow class="user-detail-title">
      编辑成员信息
    </ElRow>
    <ElRow class="user-detail-operation-bar">
      <ElButton size="mini" type="primary" icon="el-icon-success">
        保存
      </ElButton>
      <ElButton size="mini" icon="el-icon-error" @click="cancel">
        取消
      </ElButton>
    </ElRow>

    <ElRow type="flex" align="middle" class="user-detail-user-box">
      <ElCol class="user-detail-avatar">
        <img :src="avatar" />
      </ElCol>
      <ElCol class="user-detail-user">
        <ElRow class="user-detail-user-txt">
          <span style="margin-right:10px">姓名：</span>
          <span>{{ username }}</span>
        </ElRow>
        <ElRow class="user-detail-user-txt">
          <span style="margin-right:10px">别名：</span>
          <span> {{ alias }}</span>
        </ElRow>
      </ElCol>
    </ElRow>

    <ElRow class="user-detail-operation-bar">
      <ElButton size="mini" type="primary" icon="el-icon-success">
        保存
      </ElButton>
      <ElButton size="mini" icon="el-icon-error">
        取消
      </ElButton>
    </ElRow>

    <br />
    {{ userInfo }}
    <!-- 

    

    <ElRow class="user-detail-user-set">
      <member-edit-item>
        <template slot="left">
          工号：
        </template>
        <template slot="right">
          <span v-if="employeeNumberEditing">
            <el-input
              size="mini"
              style="width:100px"
              v-model="edit_user.employeeNumber"
            ></el-input>
          </span>
          <span v-else>{{ edit_user.employeeNumber }}</span>
          <div style="margin: 0 15px">
            <div v-if="!employeeNumberEditing">
              <ElButton
                type="primary"
                icon="el-icon-edit"
                size="mini"
                style="padding: 4px 8px"
                @click="employeeNumberEditing = true"
              ></ElButton>
            </div>

            <div v-else>
              <ElButton
                type="primary"
                size="mini"
                style="padding: 4px 8px"
                @click="confirm"
                >确认</ElButton
              >
              <ElButton
                type="primary"
                size="mini"
                style="padding: 4px 8px"
                @click="cancel"
                >取消</ElButton
              >
            </div>
          </div>
        </template>
      </member-edit-item>
      <member-edit-item>
        <template slot="left">
          成员状态：
        </template>
        <template slot="right">
          <span>{{ userStatusMap[edit_user.userStatus] }}</span>
          <el-dropdown
            trigger="click"
            style="margin: 0 15px"
            placement="right"
            @command="changeMemberStatus"
          >
            <ElButton
              type="primary"
              icon="el-icon-edit"
              size="mini"
              style="padding: 4px 8px"
            ></ElButton>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(label, index) in userStatusMap"
                :command="index"
                :key="index"
                >{{ label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </member-edit-item>
      <member-edit-item>
        <template slot="left">
          入职日期：
        </template>
        <template slot="right">
          <span>{{ edit_user.entryDate || defaultDate }}</span>
          <div class="enrollment-date-edit-button">
            <ElButton
              type="primary"
              icon="el-icon-edit"
              size="mini"
              style="padding: 4px 8px;margin: 0 15px"
              @click="willChangeDate.call(this, 'entryDate')"
            >
            </ElButton>
            <el-date-picker
              class="enrollment-date-picker"
              v-model="edit_user.entryDate"
              type="date"
              ref="entryDate"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </template>
      </member-edit-item>
      <member-edit-item v-if="edit_user.userStatus >= 2">
        <template slot="left">
          转正日期：
        </template>
        <template slot="right">
          <span>{{ edit_user.correctionDate || defaultDate }}</span>
          <div class="formal-date-edit-button">
            <ElButton
              type="primary"
              icon="el-icon-edit"
              size="mini"
              style="padding: 4px 8px;margin: 0 15px"
              @click="willChangeDate.call(this, 'correctionDate')"
            >
            </ElButton>
            <el-date-picker
              class="formal-date-picker"
              v-model="edit_user.correctionDate"
              type="date"
              ref="correctionDate"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </template>
      </member-edit-item>
      <member-edit-item v-if="edit_user.userStatus === 3">
        <template slot="left">
          离职日期：
        </template>
        <template slot="right">
          <span>{{ edit_user.eparationDate || defaultDate }}</span>
          <div class="resign-date-edit-button">
            <ElButton
              type="primary"
              icon="el-icon-edit"
              size="mini"
              style="padding: 4px 8px;margin: 0 15px"
              @click="willChangeDate.call(this, 'eparationDate')"
            >
            </ElButton>
            <el-date-picker
              class="resign-date-picker"
              v-model="edit_user.eparationDate"
              type="date"
              ref="eparationDate"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </template>
      </member-edit-item>
      <member-edit-item>
        <template slot="left">
          新签合同时间：
        </template>
        <template slot="right">
          <span>{{ edit_user.newContractDate || defaultDate }}</span>
          <div class="resign-date-edit-button">
            <ElButton
              type="primary"
              icon="el-icon-edit"
              size="mini"
              style="padding: 4px 8px;margin: 0 15px"
              @click="willChangeDate.call(this, 'newContractDate')"
            >
            </ElButton>
            <el-date-picker
              class="resign-date-picker"
              v-model="edit_user.newContractDate"
              type="date"
              ref="newContractDate"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </template>
      </member-edit-item>
      <member-edit-item>
        <template slot="left">
          合同到期时间：
        </template>
        <template slot="right">
          <span>{{ edit_user.contractExpirationDate || defaultDate }}</span>
          <div class="resign-date-edit-button">
            <ElButton
              type="primary"
              icon="el-icon-edit"
              size="mini"
              style="padding: 4px 8px;margin: 0 15px"
              @click="willChangeDate.call(this, 'contractExpirationDate')"
            >
            </ElButton>
            <el-date-picker
              class="resign-date-picker"
              v-model="edit_user.contractExpirationDate"
              type="date"
              ref="contractExpirationDate"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </template>
      </member-edit-item>

      <member-edit-item>
        <template slot="left">
          调休：
        </template>
        <template slot="right">
          <div
            style="flex-direction: row;align-items: center;"
            class="leave-container"
            v-if="edit_user && edit_user.leaveInfo"
          >
            <span>{{
              $hourCalculate(edit_user.availableLeaveInLieu + extraLieu)
            }}</span>

            <el-dropdown
              trigger="click"
              size="mini"
              placement="right"
              :hide-on-click="false"
            >
              <ElButton
                type="primary"
                icon="el-icon-edit"
                size="mini"
                style="padding: 4px 8px; margin-left: 15px;"
              ></ElButton>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item style="width:400px">
                  <el-slider
                    v-model="extraLieu"
                    :max="50"
                    :min="-Math.ceil(edit_user.availableLeaveInLieu)"
                    show-input
                    class="annual-vacation-slider"
                  ></el-slider>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else>空</div>
        </template>
      </member-edit-item>

      <member-edit-item>
        <template slot="left">
          年假：
        </template>
        <template slot="right">
          <div
            class="leave-container"
            v-if="
              edit_user &&
                edit_user.leaveDetailInfo.produceDetailInfoList.length
            "
          >
            <div
              class="leave-container-item"
              v-for="(item,
              index) in edit_user.leaveDetailInfo.produceDetailInfoList.filter(
                item => {
                  return new Date(item.expireDate) > new Date();
                }
              )"
              :key="item.id"
            >
              <span
                >{{
                  $hourCalculate(
                    item.availableLeave +
                      (extraLeave[item.id + "," + index] || 0)
                  )
                }}
                （到期时间：{{ item.expireDate }}）</span
              >
              <el-dropdown
                trigger="click"
                size="mini"
                placement="right"
                :hide-on-click="false"
              >
                <ElButton
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  style="padding: 4px 8px; margin-left: 15px;"
                ></ElButton>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item style="width:400px">
                    <el-slider
                      v-model="extraLeave[item.id + ',' + index]"
                      :max="50"
                      :min="-Math.ceil(item.availableLeave)"
                      show-input
                      class="annual-vacation-slider"
                    ></el-slider>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div v-else>空</div>
        </template>
      </member-edit-item>
    </ElRow>

     -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Container from "web/page/oa/view/container.vue";

@Component<UserEdit>({
  created() {
    this.$dispatch
      .user_info({
        userid: this.$state.route.params.userid
      })
      .then(data => {
        console.log(data);
      });
  }
})
export default class UserEdit extends Vue {
  get userInfo() {
    return this.$getters.user_dictionary[this.$state.route.params.userid];
  }
  get avatar() {
    return this.userInfo.avatar || require(`web/page/oa/assets/rg.png`);
  }
  get username() {
    return this.userInfo.name;
  }
  get alias() {
    return this.userInfo.alias;
  }

  cancel() {
    this.$router.go(-1);
  }
}
</script>
<style lang="scss" scoped>
.user-edit {
  width: 1000px;
  color: #606266;
  font-family: "微软雅黑";
  .user-detail-title {
    font-size: 15px;
    margin: 16px 0;
  }
  .user-detail-operation-bar {
    padding: 8px 10px;
    background: #dfe9f5;
  }
  .user-detail-user-box {
    margin: 20px 0 20px 10px;
    padding: 0 0 10px 0;
    border-bottom: 1px dashed #e4e6e9;
  }
  .user-detail-avatar {
    width: 65px;
    height: 65px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .user-detail-user-txt {
    font-size: 14px;
    padding: 7px 16px;
  }
  // .user-detail-user-set {
  //   margin: 10px 0;
  // }
}
</style>