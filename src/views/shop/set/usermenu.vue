<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','MWSYSTEMGROUPDATA_ALL','MWSYSTEMGROUPDATA_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="map.name" label="菜单名" />
      <el-table-column prop="map.url" label="链接url" />
      <el-table-column prop="map.uniapp_url" label="uniapp路由" />
      <el-table-column ref="table" label="图标">
        <template slot-scope="scope">
          <a :href="scope.row.map.pic" style="color: rgb(64, 158, 255)" target="_blank">
            <img :src="scope.row.map.pic" alt="点击打开" class="el-avatar">
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.status === 1" style="cursor: pointer" :type="''">显示</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'info' ">不显示</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','MWSYSTEMGROUPDATA_ALL','MWSYSTEMGROUPDATA_EDIT','MWSYSTEMGROUPDATA_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','MWSYSTEMGROUPDATA_ALL','MWSYSTEMGROUPDATA_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['admin','MWSYSTEMGROUPDATA_ALL','MWSYSTEMGROUPDATA_DELETE']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import { del } from '@/api/mwSystemGroupData'
import eForm from './usermenuform'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/mwSystemGroupData'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort, groupName: 'mshop_my_menus' }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
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
        id: data.id,
        groupName: data.groupName,
        name: data.map.name,
        url: data.map.url,
        wxapp_url: data.map.wxapp_url,
        uniapp_url: data.map.uniapp_url,
        pic: data.map.pic,
        imageArr: data.map.pic ? data.map.pic.split(',') : [],
        sort: data.sort,
        status: data.status
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
