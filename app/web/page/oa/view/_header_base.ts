import { Vue, Component } from "vue-property-decorator";

@Component<HeaderBase>({
  async created() {
    const base = (await this.$dispatch.department_list()).find(item => item.parentid === 0);
    if (base) {
      this.$dispatch.user_list({
        department_id: base.id
      });
    } else {
      const error = 'can\'t not find item of department list which has no parentid'
      console.error(error);
      this.$notify.error(error)
    }
  }
})
export default class HeaderBase extends Vue {

  // static _ins: HeaderBase
  // static get instance() {
  //   return this._ins || new HeaderBase
  // }
  // constructor() {
  //   super()
  //   HeaderBase._ins = this
  // }

  get userinfo() {
    return this.$getters.user_dictionary && this.$getters.user_dictionary[this.$state.userid]
  }

  get avatar() {
    return (this.userinfo && this.userinfo.avatar) || require(`web/page/oa/assets/rg.png`);
  }

  get name() {
    return this.userinfo && this.userinfo.name;
  }

  get position() {
    return this.userinfo && this.userinfo.position;
  }

  get telephone() {
    return this.userinfo && this.userinfo.telephone;
  }

  get email() {
    return this.userinfo && this.userinfo.email;
  }

  get departmentId() {
    return this.userinfo && this.userinfo.department.join(',')
  }

}