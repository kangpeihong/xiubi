<template>
  <div class="history">
    <div class="history-list animated fadeIn">
      <div class="title">历史订单</div>
      <i class="close el-icon-close" @click="close"></i>
      <el-table :data="dataList" style="width: 100%" class="ximiBlock">
        <el-table-column prop="orderNumber" label="历史编号" width="180">
        </el-table-column>
        <el-table-column
          prop="xwEnterprise.consignee"
          label="订货人"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额"> </el-table-column>
        <el-table-column label="订单日期">
          <template slot-scope="scope">
            <span> {{ scope.row.createTime | formatData }}</span>
          </template>
        </el-table-column>

        <el-table-column label="订单详情">
          <template slot-scope="scope">
            <span>{{ scope.orderState ? "已发货" : "未发货" }}</span
            >&nbsp;&nbsp;&nbsp;
            <span>京东快递 JDKD07704086672</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="anotherList(scope.row)">再来一单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next,jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "../../assets/js/utils.js";

export default {
  name: "history",
  data() {
    return {
      dataList: [],
      orderState: "",
      createTime: "",
      pageData: {
        pageSize: 5,
        currentPage: 1
      },
      historyData: [],
      total:0
    };
  },

  created() {
    this.getDataList();
  },
  mounted() {},
  filters: {
    formatData(time) {
      var data = new Date(time);
      return utils.formatDate(data, "yyyy-MM-dd");
    }
  },
  methods: {
    getDataList() {
      var _this = this;
      const id = this.userinfo.id;

      
      this.$axios({
        method: "get",
        url: "/api/xwOrder",
        params: {
          page: _this.pageData.currentPage-1,
          size: _this.pageData.pageSize,
          id: id,
          sort: "id,desc"
        }
      }).then(res => {
        this.total = res.data.totalElements;
        this.dataList = res.data.content;
        console.log("//", this.dataList);
      });
    },
    // 当前页
    handleCurrentChange(pages) {
      this.pageData.currentPage = pages;
      this.getDataList();
    },
    // 选择每页显示的条数
    handleSizeChange(sizes) {
      this.pageData.pageSize = sizes;
      this.getDataList();
    },
    // 关闭历史订单页面
    close() {
      this.$router.push("/");
    },
    anotherList(items) {
      this.$router.push("/order");

      // 设置相对应的数据格式
      items.orderDetails.forEach((item, index) => {
        var obj = {
          productId: item.detailsId,
          price: item.price,
          orderNumber: item.orderNumber,
          product: item.product
        };

        this.historyData.push(obj)
      });
      var saveData = JSON.stringify(this.historyData);
      window.sessionStorage.setItem("listInfo", saveData);
    }
  },
  computed: {
    userinfo() {
      const token = JSON.parse(window.sessionStorage.getItem("user-token"));
      return token.xwEnterpriseDTO;
    }
  }
};
</script>

<style lang="less" scoped>



.ximiBlock::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
  border-radius: 10px !important;
  background-color: rgba(255,255,255,0.8);
}

.ximiBlock::-webkit-scrollbar
{
  width: 5px !important;
  background-color: rgba(0,0,0,0);
}
.ximiBlock::-webkit-scrollbar-thumb
{
  border-radius: 15px !important;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,.3);
  background-color: #555;
}

/deep/.el-table {
  max-height: 400px;
  overflow-y: auto;
}
.history-list {
  width: 1170px;
  max-height: 900px;
  min-height: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 5px;
  padding: 20px 20px;
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 24px;
  }
  .title {
    text-align: center;
    font-size: 25px;
    height: 60px;
    line-height: 60px;
  }
  .fenye {
    position: absolute;
    bottom: 20px;
    right: 10px;
  }
}
</style>
