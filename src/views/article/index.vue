<template>
  <div class="app-container">
    <el-date-picker v-model="createtime" type="daterange" range-separator="至" start-placeholder="开始日期"
      end-placeholder="结束日期" size="medium" @change="handleHistoryData()" style="margin-right:30px">
    </el-date-picker>

    <el-select v-model="value" placeholder="请选择状态">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>


    <el-input v-model="inputContent" style="width: 20%" class="searchinput" placeholder="请输入姓名或身份证进行查询"
      prefix-icon="el-icon-search">
      <el-button slot="append" class="searchbtn" @click="searchput">搜索</el-button>

    </el-input>


    <el-button type="primary" size="medium" @click="adddata()" style="margin-left: 15px;">添加</el-button>
    <el-table v-loading="listLoading" :data="pageInfo.records" element-loading-text="Loading" border fit
      highlight-current-row >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" >
        <template slot-scope="scope" style="height: 80px;padding: auto;">
          <img :src="scope.row.images" height="80px" width="80px">
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态"  align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="类型"  align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeFilter">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <!------------插槽--->
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="deletedata(scope.row.id)">删除</el-button>
          <el-button type="primary" size="mini" @click="updatedata(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="detial(scope.row)">详情</el-button>
          <el-dropdown style="margin-left: 20px;" @command="handleCommand">
            <span class="el-dropdown-link"  >
              状态<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="beforeHandleCommand('正常',scope.row.id)">正常</el-dropdown-item>
              <el-dropdown-item :command="beforeHandleCommand('隐藏',scope.row.id)">隐藏</el-dropdown-item>
              <el-dropdown-item :command="beforeHandleCommand('推荐',scope.row.id)">推荐</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :hide-on-single-page="true" @current-change="handleCurrentChange"
      :current-page="pageInfo.current" :page-size="pageInfo.size" layout="total, prev, pager, next, jumper"
      :total="pageInfo.total"></el-pagination>
    <!------弹框----------->
    <el-dialog :visible.sync="dialogVisible" v-if='dialogVisible'>
      <dialogPage :rowdata="rowdata"></dialogPage>
    </el-dialog>
    <!------详情-------->
    <el-dialog :visible.sync="dialogVisibles" v-if='dialogVisibles'>
      <detail :rowdata="rowdata"></detail>
    </el-dialog>

  </div>
</template>
<script>
import { getListarticle } from '@/api/article'
import { delListarticle } from '@/api/article'
import { addarticle } from '@/api/article'
import dialogPage from './add.vue'
import detail from './detail.vue'

export default {
  components: {
    dialogPage,
    detail
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '正常': 'success',
        '隐藏': 'gray',
        '推荐': 'danger'
      }
      return statusMap[status]
    },
    typeFilter(status) {
      const statusMap = {
        '视频': 'success',
        '图文': 'gray',
        '组图': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      pageInfo: {
        size: 10,
        current: 1,
        total: 0,
        records: [],
      },
      form: {
        title: '',
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '正常',
          label: '正常'
        },
        {
          value: '隐藏',
          label: '隐藏'
        }, {
          value: '推荐',
          label: '推荐'
        }],
      value: '',
      page: 1,
      listLoading: true,
      inputContent: '',
      createtime: '',
      dialogVisible: false,
      dialogVisibles: false,
      rowdata: ''
    }
  },
  created() {
    this.fetchData(1, 10)
  },
  methods: {
    fetchData(page, limit) {
      this.listLoading = true
      let keyword = this.inputContent
      let createtime = this.createtime
      let status = this.value
      console.log(this.value);
      getListarticle({ page, limit, keyword, createtime, status }).then(response => {
        this.pageInfo.records = response.data.items;
        this.pageInfo.total = response.data.total;
        this.listLoading = false
      })
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchData(page, 10);
    },
    deletedata(id) {
      this.listLoading = true
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {

          delListarticle({ id }).then(response => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });

            this.fetchData(this.page, 10)
          })
        })
        .catch(() => {
          // this.$message.error
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          this.listLoading = false
        });

    },
    handleCommand(command) {
      
      addarticle(command).then(response => {
               // location.reload();
          this.fetchData(this.page, 10)
      })

      },
      beforeHandleCommand(status,id){   //index我这里是遍历的角标，即你需要传递的额外参数
            return {
            'status': status,
            'id':id
        }
    },

    updatedata(data) {

      this.rowdata = data;

      this.dialogVisible = true;
    },
    adddata() {
      this.rowdata = {};
      this.dialogVisible = true;
    },
    detial(data){
      this.rowdata = data;
      console.log(222);
      this.dialogVisibles = true;
    },
    //搜索
    searchput() {
      this.fetchData(1, 10)
    },
    //时间
    handleHistoryData(val) {
      let that = this;
      that.createtime(val)
    }
  }

}
</script>
<style lang="scss" scoped>
.el-tag {
  margin: 0 5px;
}

.el-pagination {
  margin-top: 10px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>