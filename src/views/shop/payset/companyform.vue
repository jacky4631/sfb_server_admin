<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
<!--      <el-form-item label="主体id">-->
<!--        <el-input v-model="form.id"/>-->
<!--      </el-form-item>-->
      <el-form-item label="主体名称">
        <el-input v-model="form.company"/>
      </el-form-item>
<!--      <el-form-item label="营业执照">-->
<!--      <el-input v-model="form.licenseUrl"/>-->
<!--    </el-form-item>-->
<!--      <el-form-item label="公章">-->
<!--        <el-input v-model="form.sealUrl"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="手机号">-->
<!--        <el-input v-model="form.phone"/>-->
<!--      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!--<el-input v-model="form.groupName" />-->
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/mwPayCompany'
import picUpload from '@/components/pic-upload'
export default {
  components: { picUpload },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: 0,
        company: '',
        licenseUrl: '',
        sealUrl: '',
        phone: '',
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
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
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
    doEdit() {
      edit(this.form).then(res => {
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
        id: 0,
        company: '',
        licenseUrl: '',
        sealUrl: '',
        phone: '',
      }
    }
  }
}
</script>

<style scoped>

</style>
