<template>
  <div class="fbox animated fadeIn">
    <i class="el-icon-close clbtn" @click="goback"></i>
    <div class="orderList" id="print">
      <div id="pdfDom">
        <div class="orderLogo">
          <img src="../../assets/images/logo.jpg" alt="" />
          <span class="lot">修文印刷订单
            {{ time ? timestampToTime(time) : "历史订单列表" }}</span>
        </div>
        <!-- <div v-show="horders" style="width:100%;positon:relative">{{orderId}}  <a @click="back" style="position:absolute; right:70px">返回当前订单</a></div> -->
        <table class="orderInfo" v-if="info">
          <tr>
            <td>名称</td>
            <td>数量</td>
            <!-- <td>单价</td> -->
            <td>单位</td>
            <td>金额/元</td>
          </tr>
          <tr v-for="item in proList" :key="item.productId">
            <td>{{ item.product.productName }}</td>
            <td>
              <input :disabled='disabled' type="number" v-model.number.trim="item.orderNumber" oninput="if(this.value.length == 1){this.value = this.value.replace(/[^1-9]/g,'');}" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" class="number" min="1" @input="reSet" />
            </td>
            <!-- <td>{{item.price}}</td> -->
            <td>{{ item.product.productUnits }}</td>
            <td>{{ toDecimal2(item.totalprice) }}</td>
          </tr>
          <tr>
            <td>合计金额:</td>
            <td></td>
            <!-- <td></td> -->
            <td></td>
            <td>{{ toDecimal2(totalPrice) }}</td>
          </tr>
          <tr>
            <td>运费:</td>
            <td></td>
            <!-- <td></td> -->
            <td></td>
            <td>{{ freight }}</td>
          </tr>
          <tr>
            <td>应付总额:</td>
            <td></td>
            <!-- <td></td> -->
            <td></td>
            <td>{{ toDecimal2(totalPrice + freight) }}</td>
          </tr>
        </table>

        <div class="describes" v-if="info">
          <span>备注:</span>
          <textarea name="" id="" cols="30" rows="10" v-model="describes" :disabled='disabled'></textarea>
        </div>
        <div class="company company1" v-if="info">
          <div class="left">发票信息:</div>
          <div class="mid">
            <p>{{ userinfo.enterpriseName }} {{ userinfo.creditCode }}</p>
            <p>{{ userinfo.registeredAddress }} {{ userinfo.phoneNumber }}</p>
            <p>{{ userinfo.bankAccount }} {{ userinfo.accountOpening }}</p>
          </div>
          <div v-show="order">
            <span @click="change(2)">修改</span>
          </div>
        </div>
        <div class="company" v-if="info">
          <div class="left">收货人信息:</div>
          <div class="mid">
            <p>{{ userinfo.harvestAddress }}</p>
            <p>{{ userinfo.consignee }} {{ userinfo.telephone }}</p>
          </div>
          <div v-show="order">
            <span @click="change(3)">修改</span>
          </div>
        </div>
        <div class="company" v-if="info">
          <div class="left">收款账号:</div>
          <div class="mid">
            <p>北京修文印刷技术有限公司</p>
            <p>招商银行股份有限公司北京北三环支行 &nbsp; 110917960410501</p>
          </div>
          <div style="width:30px" v-show="order"></div>
        </div>
      </div>

      <!-- <div style="height:508px">
      <div>
        <div class="title">
          <p>历史编号</p>
          <p>订货人</p>
          <p>订单金额</p>
          <p>订单状态</p>

        </div >
        <div v-for="item in orderList" :key="item.orderId" @click="horder(item.orderNumber)" class="orderlist">
          <div>
            <span>{{item.orderNumber.substring(2,9)}}</span>
          <span>{{item.xwEnterprise.consignee}}</span>
          <span>{{toDecimal2(item.orderAmount)}}</span>
          <span>{{item.orderState ? "已发货" : "未发货"}}</span>
          <span>京东快递 JDKD07704086672</span>
          </div>
          <div class="bt"></div>
        </div>
      </div>
    </div>
    <div class="block" v-if="this.totalOrder > 10 ">
      <span class="demonstration">共{{this.totalOrder}}条历史订单 </span>
      <el-pagination
        layout="prev, pager, next"
        :total="totalOrder"
        @current-change="onPageChange"
        >
      </el-pagination>
    </div> -->
    </div>
    <div class="orderBtn" v-if="info">
      <input type="button" value="确认订单" class="right" @click="creatOrder" v-show="order" />
      <!-- <el-button @click="historyOrder">历史订单</el-button> -->
      <input type="button" value="历史订单" @click="historyOrder" class="historyBtn" />
      <input type="button" value="再来一单" class="left" @click="creatOrder" v-show="!again" />
      <input type="button" value="打印订单" class="right" v-if="!order" v-print="print"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Order",
  data() {
    return {
      print: {
        id: "print",
        ignoreClass: "right",
        standard: "loose",
        popTitle: "",
        extraHead: "222",
        extraHead:
          '<meta http-equiv="Content-Language"content="zh-cn"/>,<style> #print { height: auto !important; } <style>',
      },
      proList: [],
      disabled: false,
      name: "",
      orderList: [],
      arr: [],
      htmlTitle: "订单",
      totalOrder: 0,
      page: 1,
      order: true,
      info: true,
      totalPrice: 0,
      orderId: "",
      orderIds: "",
      horders: false,
      again: true,
      describes: "",
      time: "",
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.getOrder();
  },
  methods: {
    getData() {
      const listInfo = window.sessionStorage.getItem("listInfo");
      // const orderInfo = window.sessionStorage.getItem('order')
      // if (listInfo) {
      if (!listInfo) {
        this.info = false;
      }
      this.proList = JSON.parse(listInfo);
      this.totalPrice = 0;
      this.proList.forEach((item) => {
        item.totalprice = item.orderNumber * item.price;
        this.totalPrice += parseFloat(item.totalprice);
      });
      // } else {
      //   this.proList = JSON.parse(orderInfo).data.data.orderDetails
      // }
      const d = new Date();
      this.time = Number(d);
    },
    getOrder(page = 0) {
      const id = this.userinfo.id;
      this.$axios({
        method: "get",
        url: "/api/xwOrder",
        params: {
          page: this.page - 1,
          size: 10,
          id: id,
          sort: "id,desc",
        },
      }).then((res) => {
        this.orderList = res.data.content;
        this.totalOrder = res.data.totalElements;
      });
    },

    historyOrder() {
      this.$router.push("./historyPage");
    },
    // 保留小数点后两位
    toDecimal2(x) {
      var f = parseFloat(x);

      f = Math.round(f * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },
    // total () {
    //   this.totalPrice = 0
    //   this.proList.forEach(item => {
    //     this.totalPrice += parseFloat(item.totalPrice)
    //   })
    // },
    change(id) {
      if (id === 2) {
        this.$router.push({ path: "/modifyinfo" });
      } else if (id === 3) {
        this.$router.push({ path: "/modifyadd" });
      }
    },
    creatOrder() {
      this.arr = this.proList.filter(function (item) {
        return item.orderNumber;
      });
      this.arr.forEach((item) => {
        item.detailsId = null;
      });
      this.$confirm("提示", {
        title: "提示",
        message: "确认要提交订单吗？",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.disabled = true;
          this.order = false;
          this.$axios({
            method: "post",
            url: "/api/xwOrder/create",

            data: {
              address: this.userinfo.harvestAddress,
              contactNumber: this.userinfo.telephone,
              freight: this.freight,
              describes: this.describes,
              xwEnterprise: {
                accountOpening: this.userinfo.accountOpening,
                bankAccount: this.userinfo.bankAccount,
                consignee: this.userinfo.consignee,
                creditCode: this.userinfo.creditCode,

                enterpriseCode: this.userinfo.enterpriseCode,
                enterpriseName: this.userinfo.enterpriseName,
                harvestAddress: this.userinfo.harvestAddress,
                id: this.userinfo.id,
                invoiceInformation: this.userinfo.invoiceInformation,
                phoneNumber: this.userinfo.phoneNumber,
                registeredAddress: this.userinfo.registeredAddress,
                telephone: this.userinfo.telephone,
              },
              orderDetails: this.arr,
              orderState: false,
              paymentStatus: false,
              orderAmount: this.totalPrice + this.freight,
            },
          })
            .then((res) => {
              console.log("44444", res);
              this.orderIds = res.data.id;
              this.getOrder();
              this.$notify({
                title: "订单提交成功",
                message: "请您关注物流信息,谢谢",
                type: "success",
              });
              // window.sessionStorage.setItem('order', JSON.stringify(res))
              window.sessionStorage.removeItem("listInfo");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => ({})); // 不要忘记catch
      // 最后可以.finally(()=>({}))
    },

    timestampToTime(timestamp) {
      var date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + "-";
      const M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      const D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      const h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      const m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      const s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // onPrint() {
    //   console.log(".....mmm", this.proList);
    //   var arr = [];
    //   this.proList.forEach((item, index) => {
    //     var obj = {
    //       productName: item.product.productName,
    //     };
    //     arr.push(obj);
    //   });
    //   var _this = this;
    //   console.log("vvvvvvvvvvvvvvvvvvvv", arr);
    //   this.$axios({
    //     method: "GET",
    //     url: `api/xwOrder/download/${_this.orderIds}`,
    //   }).then((res) => {
    //     console.log("888", res);
    //   });

    //   // const date = new Date();
    //   // const time = `${date.getFullYear()}/${
    //   //   date.getMonth() + 1
    //   // }/${date.getDate()}    `;
    //   // this.htmlTitle = this.htmlTitle + time;
    //   // this.getPdf("pdfDom", this.htmlTitle);
    // },
    onPageChange(page) {
      this.page = page;
      this.getOrder(page - 1);
    },
    goback() {
      window.sessionStorage.removeItem("listInfo");
      this.$router.replace("/");
      window.location.reload();
    },
    horder(id) {
      // this.$router.push({ name: 'Horder', params: { orderNumber: id } })
      this.again = false;
      this.order = false;
      this.$axios({
        method: "get",
        url: "/api/xwOrder",
        params: {
          orderNumber: id,
        },
      }).then((res) => {
        const [{ orderDetails }] = res.data.content;

        this.proList = orderDetails;
        this.totalPrice =
          res.data.content[0].orderAmount - res.data.content[0].freight;
        this.orderId = res.data.content[0].orderNumber;
        this.horders = true;
        this.info = true;
        this.describes = res.data.content[0].describes;
        this.time = res.data.content[0].createTime;
      });
    },
    endPrice(productPrices, index) {
      if (productPrices.length > 1) {
        for (var i = 0; i < productPrices.length; i++) {
          if (
            this.proList[index].orderNumber >= productPrices[i].productNumber &&
            this.proList[index].orderNumber < productPrices[i + 1].productNumber
          ) {
            return productPrices[i].price;
          } else if (
            this.proList[index].orderNumber >=
            productPrices[productPrices.length - 1].productNumber
          ) {
            return productPrices[productPrices.length - 1].price;
          }
        }
      }
      return productPrices[0].price;
    },
    back() {
      window.location.reload();
    },
    reSet() {
      window.sessionStorage.setItem("listInfo", JSON.stringify(this.proList));
      this.getData();
    },
  },
  computed: {
    userinfo() {
      const token = JSON.parse(window.sessionStorage.getItem("user-token"));
      return token.xwEnterpriseDTO;
    },
    freight() {
      if (this.totalPrice >= 300) {
        return 0;
      } else {
        return Math.ceil(this.totalPrice * 0.08) > 10
          ? Math.ceil(this.totalPrice * 0.08)
          : 10;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@page {
  size: auto; /* auto is the initial value */
  margin: 3mm; /* this affects the margin in the printer settings */
}

html {
  background-color: #ffffff;
  margin: 0px; /* this affects the margin on the html before sending to printer */
}

body {
  border: solid 1px blue;
  margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
}

// ?以上是隐藏打印页面的页眉和页脚！
.demonstration {
  font-size: 13px;
}
.orderList {
  width: 700px;
  height: 830px;
  // height: auto;
  background-color: #fff;
  // border: 1px solid #605d5e;
  font-family: YouYuan;
  font-weight: 600;
  font-size: 18px;
  box-sizing: border-box;
  padding: 50px 95px 0px;
  overflow: hidden;
}
.historyBtn {
  position: absolute;
  left: 95px;
  bottom: 10px;
  padding: 2px;
}
.orderInfo tr td:last-child {
  text-align: right;
  padding-left: 100px;
}
.orderInfo tr td:nth-child(3) {
  text-align: center;

  padding-left: 24px;
}
.orderInfo tr td:first-child {
  width: 185px;
}
.orderInfo tr td:nth-child(2) {
  padding-left: 10px;
  text-align: center;
  // input{
  //   width: 50px
  // }
}
.orderInfo tr:first-child {
  font-size: 16px;
  height: 40px;
}
.orderInfo tr {
  border-bottom: 1px solid #c8c5c4;
  height: 30px;
}
.orderInfo {
  margin-bottom: 20px;
}
.modify {
  height: 50px;
}
table {
  border-collapse: collapse;
  width: 100%;
  font-size: 13px;
}
.company {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #c8c5c4;
  font-size: 13px;
  padding-top: 5px;
  line-height: 18px;
  .mid {
    width: 395px;
  }
  .left {
    width: 80px;
  }
  p {
    flex: 1;
    margin: 0;
    height: 20px;
  }
}
.company1 {
  border-top: 1px solid #c8c5c4;
}
.orderBtn {
  // border-bottom: 1px solid #c8c5c4;
  text-align: justify;
  height: 60px;
  position: relative;
  // top: 100px;
  input {
    background-color: #fff;
    border: 1px solid #000;
    outline: none;
    font-size: 13px;
  }
  .left {
    position: absolute;
    left: 95px;
    bottom: 10px;
  }
  .right {
    position: absolute;
    right: 95px;
    bottom: 10px;
    padding: 2px;
  }
}
/deep/ .el-pagination {
  display: inline-block;
}
.orderList {
  overflow: scroll;
  position: relative;
}
.return {
  position: absolute;
  z-index: 999;
  left: 0;
  bottom: 0;
  font-size: 15px;
  font-weight: 700;
}

.fbox {
  width: 700px;
  height: 900px;
  position: absolute;
  background: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .clbtn {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 18px;
    z-index: 9;
  }
}
.ordered {
  width: 100%;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.block {
  padding-bottom: 15px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"] {
  -moz-appearance: textfield;
}

.describes {
  margin-bottom: 20px;
  font-size: 13px;
  margin-top: 3px;
  height: 60px;
  width: 100%;
  border: 1px solid #67605d;
  position: relative;
  span {
    position: absolute;
    top: 2px;
  }
  textarea {
    font-family: YouYuan !important;
    border: none;
    resize: none;
    outline: none;
    height: 58px;
    width: 420px;
    display: inline-block;
    margin-left: 40px;
  }
}

.orderLogo {
  font-size: 13px;
  // position: absolute;
  // left: 40px;
  margin-left: -40px;
  margin-bottom: 20px;
  img {
    height: 40px;
    margin-bottom: -4px;
    padding-right: 65px;
  }
  .lot {
    position: absolute;
    left: 78px;
    top: 75px;
  }
}
.title {
  border-bottom: 1px solid #c8c5c4;
  font-size: 15px;
  p {
    display: inline-block;
  }
  p:first-child {
    padding-right: 35px;
  }
  p:nth-child(3) {
    padding-left: 50px;
    padding-right: 30px;
  }
}

.orderlist {
  div {
    border-bottom: 1px solid #c8c5c4;
    height: 23px;
  }
  span {
    display: inline-block;
    font-size: 12px;
    line-height: 20px;
    margin-top: -3px;
  }
  span:first-child {
    width: 96px;
    padding-left: 3px;
  }
  span:nth-child(2) {
    width: 96px;
  }
  span:nth-child(3) {
    width: 91px;
  }
  span:nth-child(4) {
    padding-right: 5px;
  }
  .bt {
    background-color: #dcdddd;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.number {
  width: 40px;
  font-size: 12px;
  padding: 0;
}
</style>
