<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'热度修改'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="用户昵称">
        <el-input v-model="form.nickname" :disabled="true" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="修改热度">
        <el-radio v-model="form.ptype" :label="1">增加</el-radio>
        <el-radio v-model="form.ptype" :label="2">减少</el-radio>
      </el-form-item>
      <el-form-item label="平台">
        <el-input v-model="form.platform" style="width: 370px;" />
        <p style="color: red">tb jd pdd dy vip</p>
      </el-form-item>
      <el-form-item label="热度类型">
        <el-input v-model="form.type" style="width: 370px;" />
        <p style="color: red">0=赠送 1=推广</p>
      </el-form-item>
      <el-form-item label="用户热度">
        <el-input v-model="form.energy" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {add, edit, edite, editp} from '@/api/mwUser'
import md5 from 'js-md5';
export default {
  props: {
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        uid: '',
        nickname: '',
        energy: '',
        platform: 'tb',//平台 tb jd pdd dy vip
        type: 1, // 0 增送 1=推广
        ptype: '1'
      },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      this.doEdit()
    },
    doEdit() {
      edite(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        uid: '',
        nickname: '',
        energy: '',
        platform: 'tb',//平台 tb jd pdd dy vip
        type: 1, // 0 增送 1=推广
        ptype: '1'
      }
    }
  }
}
</script>

<style scoped>

</style>
