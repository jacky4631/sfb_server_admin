<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="uid" clearable placeholder="输入左边uid" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-input v-model="origUid" clearable placeholder="输入全部uid" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-input v-model="mark" clearable placeholder="输入描述" style="width: 250px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-select v-model="category" clearable placeholder="明细种类" class="filter-item" style="width: 130px">
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="inOuttype" clearable placeholder="进出账" class="filter-item" style="width: 130px">
        <el-option
          v-for="item in inOutOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="unlockStatus" clearable placeholder="解锁状态" class="filter-item" style="width: 130px">
        <el-option
          v-for="item in unlockStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        class="filter-item"
        v-model="startTime"
        type="date"
        placeholder="开始日期"
        value-format="yyyy-MM-dd"
        style="width: 180px">
      </el-date-picker>
      <el-date-picker
        class="filter-item"
        v-model="endTime"
        type="date"
        placeholder="结束日期"
        value-format="yyyy-MM-dd"
        style="width: 180px">
      </el-date-picker>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button
        type="danger"
        class="filter-item"
        size="mini"
        icon="el-icon-refresh"
        @click="toQuery"
      >刷新</el-button>


    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <pForm ref="formp" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="uid" label="用户id" />
      <el-table-column prop="origUid" label="原用户id" />
      <el-table-column prop="mark" label="描述" width="400"/>
      <el-table-column prop="category" label="明细种类">
        <template slot-scope="scope">
          <span v-if="scope.row.category == 'now_money'">余额</span>
          <span v-else-if="scope.row.category == 'integral'">积分</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="明细数字">
        <template slot-scope="scope">
          <span v-if="scope.row.pm == 1">+</span>
          <span v-else>-</span>
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="余额"/>
      <el-table-column prop="platform" label="平台"/>
      <el-table-column prop="unlockStatus" label="解锁状态">
        <template slot-scope="scope">
          <span style="color: grey" v-if="scope.row.unlockStatus == 2">已失效</span>
          <span style="color: red" v-else-if="scope.row.unlockStatus == 1">未解锁</span>
          <span style="color: limegreen" v-else>已解锁</span>
        </template>
      </el-table-column>
      <el-table-column prop="unlockTime" label="解锁时间" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, jumper, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import {del, onStatus} from '@/api/mwUser'
import eForm from './form'
import pForm from './formp'
import {formatTime} from '@/utils/index'

export default {
  name:'Bill',
  components: { eForm, pForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false, origUid: '', uid: '', mark: '', category: '', type: '',inOuttype:'',startTime: '',endTime: '',shibai: '',unlockStatus: '',
      queryTypeOptions: [
        { key: 'nickname', display_name: '用户昵称' },
        { key: 'phone', display_name: '手机号码' },
        { key: 'uid', display_name: '用户id' }
      ],
      categoryOptions: [
        { value: 'now_money', label: '余额' },
        { value: 'integral', label: '积分' }
      ],
      unlockStatusOptions: [
        { value: 1, label: '未解锁' },
        { value: 2, label: '已失效' },
        { value: 0, label: '已解锁' }
      ],
      typeOptions: [
        { value: 'brokerage', label: '佣金' },
        { value: 'sign', label: '签到' }
      ],
      inOutOptions: [
        { value: 0, label: '支出' },
        { value: 1, label: '获得' }
      ],
      shibais: [
        { value: "获得推广佣金", label: '获得推广佣金' },
        { value: "系统增加余额", label: '增加余额' },
        { value: "系统减少余额", label: '减少余额' },
        { value: "佣金提现", label: '佣金提现' },
        { value: "佣金提现", label: '佣金提现' },
        { value: "购买商品", label: '购买商品' },
        { value: "商品退款", label: '商品退款' },
      ],
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    formatTime,
    checkPermission,
    onStatus(id, status) {
      this.$confirm(`确定进行[${status ? '禁用' : '开启'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          onStatus(id, { status: status }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.init()
              }
            })
          })
        })
        .catch(() => { })
    },
    beforeInit() {
      this.url = 'api/mwUserBill'
      const sort = 'id,desc'
      this.params = {
        page: this.page,
        size: this.size,
        category: this.category,
        mark: this.mark,
        type: this.type,
        pm : this.inOuttype,
        startTime: this.startTime,
        endTime: this.endTime,
        title: this.shibai,
        origUid: this.origUid,
        uid: this.uid,
        unlockStatus: this.unlockStatus
      }
      const query = this.query
      const type = query.type
      const value = query.value
      const pm = query.inOuttype
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(uid) {
      this.delLoading = true
      del(uid).then(res => {
        this.delLoading = false
        this.$refs[uid].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[uid].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        uid: data.uid,
        account: data.account,
        pwd: data.pwd,
        realName: data.realName,
        birthday: data.birthday,
        cardId: data.cardId,
        mark: data.mark,
        partnerId: data.partnerId,
        groupId: data.groupId,
        nickname: data.nickname,
        avatar: data.avatar,
        phone: data.phone,
        addTime: data.addTime,
        addIp: data.addIp,
        lastTime: data.lastTime,
        lastIp: data.lastIp,
        nowMoney: data.nowMoney,
        brokeragePrice: data.brokeragePrice,
        integral: data.integral,
        signNum: data.signNum,
        status: data.status,
        level: data.level,
        spreadUid: data.spreadUid,
        spreadTime: data.spreadTime,
        userType: data.userType,
        isPromoter: data.isPromoter,
        payCount: data.payCount,
        spreadCount: data.spreadCount,
        cleanTime: data.cleanTime,
        addres: data.addres,
        adminid: data.adminid,
        loginType: data.loginType
      }
      _this.dialog = true
    },
    editP(data) {
      this.isAdd = false
      const _this = this.$refs.formp
      _this.form = {
        uid: data.uid,
        nickname: data.nickname,
        ptype: 1,
        money: 0
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
