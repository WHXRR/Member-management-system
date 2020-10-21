<template>
  <div>
    <!-- 行内表单 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="birthday">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60px"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="100px"></el-table-column>
      <el-table-column prop="birthday" label="会员生日" width="120px"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="130px"></el-table-column>
      <el-table-column prop="integral" label="可用积分" width="100px"></el-table-column>
      <el-table-column prop="money" label="开卡金额" width="110px"></el-table-column>
      <el-table-column prop="payType" label="支付类型" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.payType | payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"></el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 弹窗 -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form :rules="rules" ref="pojoForm" label-width="100px" label-position="right" style="width:400px" :model="pojo">
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="会员生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button type="primary" @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import memberApi from "@/api/member";

const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" },
];
export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页展示的条数
      searchMap: {
        cardNum: "",
        name: "",
        payType: "",
        birthday: "",
      }, //条件查询的条件值
      payTypeOptions,
      dialogFormVisible: false,
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: '',
        phone: '',
        money: 0,
        integral: 0,
        payType: "",
        address: ''
      },
      rules: {
        cardNum: [
          {required: true, message: '卡号不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        payType: [
          {required: true, message: '支付类型不能为空', trigger: 'change'}
        ]
      }
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // memberApi.getList().then((response) => {
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          // console.log(response);
        });
    },
    handleEdit(id) {
      console.log("编辑" + id);
      this.handleAdd()
      memberApi.getById(id).then(response => {
        const resp = response.data
        if(resp.flag) {
          this.pojo = resp.data
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          memberApi.update(this.pojo).then(response => {
            const resp = response.data
            if(resp.flag){
              this.fetchData()
              this.dialogFormVisible = false
            }else {
              this.$message({
                message: resp.emssage,
                type: 'warning'
              })
            }
          })
        }else {
          return false
        }
      })
    },
    handleDelete(id) {
      console.log("删除" + id);
      this.$confirm('确认删除这条记录吗?', "提示", {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
          console.log('1');
          memberApi.deleteById(id).then(response => {
            const resp = response.data
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'error'
            })
            if(resp.flag) {
              this.fetchData()
            }
          })
      }).catch(() => {
          console.log('2');
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          console.log('addData');
          memberApi.add(this.pojo).then(response => {
            const resp = response.data
            if(resp.flag) {
              this.fetchData()
              this.dialogFormVisible = false
            }else {
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
        }else {
          return false
        }
      })
    },
    handleAdd() {
      // this.pojo = {}
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['pojoForm'].resetFields()
      })
    },
  },
  filters: {
    payTypeFilter(type) {
      const payObj = payTypeOptions.find((obj) => obj.type === type);
      return payObj ? payObj.name : null;
    },
  },
};
</script>

<style scoped>
</style>