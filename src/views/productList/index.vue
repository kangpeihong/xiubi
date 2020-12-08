<template>
  <div class="box">
    <div style="width:158px;height:150px" class="prolist" v-if="!drawer" @click="add">
      <div class="left">
        <img src="../../assets/images/tuijian.jpg" alt="" />
        <div class="tile">客信 (精选)</div>
        <div class="right" @click="closePage">
          <!-- <img src="../../assets/images/prolistBtn.jpg" alt=""> -->
          <span class="iconfont icon-liebiao1"></span>
          <span class="animated bounceIn">商品列表</span>
          <!-- <p class="animated bounceIn">客信 (精选)</p> -->
        </div>
      </div>
    </div>

    <el-drawer title="我是标题" :visible.sync="drawer" direction="btt" :with-header="false" :size="size" :modal="true" @click.native="size === '100%' ? (size = '50%') : (size = '100%')">

      <div class="kong"></div>
      <!-- 商品数据列表2.0 -->

      <!-- <div class="aData"
            v-for="item in productdivst"
            :key="item.productId">
            <img :src="`https://www.xiubi.com.cn/image/${item.fileName}`" alt="">
          <div class="orderText">
            <p>{{item.productName}}</p>
            <p>{{item.productPrices[0].price}}元/张</p>
            <p>{{item.productPrices[0].productNumber}}</p>
          </div>

        </div> -->

      <div class="list">
        <el-row :gutter="15">
          <el-col :span="2" class="container" v-for="(item, index) in productList" :key="item.productId" @click.stop="size = '100%'">
            <div class="box-card" @click.stop="size = '100%'">
              <div class="imgbox">
                <!-- @mouseenter="showImg(item.bigFilePath) -->
                <!-- @mouseleave="hideImg" -->
                <img :src="`${item.bigFilePath}_resize_?w=300&h=100`" alt="" class="img" />
                <span class="iconfont icon-icon" @click.stop="big(item.bigFilePath)"></span>
              </div>

              <div class="orderText">
                <p :title="item.productName">{{ item.productName }}</p>

                <p>
                  ￥{{
                    (orderList[index].price = endPrice(
                      item.productPrices,
                      index
                    ))
                  }}元/{{ item.productUnits }}
                </p>
                <input type="number" v-model.number.trim="orderList[index].orderNumber" @click.stop="" oninput="if(value.length>5)value=value.slice(0,5)" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" placeholder="请输入" />
                <p>{{ item.productDesc }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="trBtn">
        <div class="tright" @click.stop="closeDrawer">
          <span class="iconfont icon-shouqi2"></span>
        </div>
        <div>
          <input type="button" value="确认订单" @click.stop="onSubmit" class="subBtn" />
        </div>
      </div>
      <div class="mengceng" v-if="bigImg.show">
        <div :class="bigImg" ref="bigImg" class="bigImgs animated animate__fadeIn" @click.stop="size = '100%'">
          <img :src="img" alt="" class="followm animated zoomIn" />
          <i class="el-icon-error animated zoomIn" @click.stop="closeBigImg"></i>
        </div>
      </div>
      <!-- <el-dialog  :visible.sync="bigImg.show" >
        <div :class="bigImg" ref="bigImg" class="bigImgs animated animate__fadeIn">
          <img :src="img" alt="" class="followm animated zoomIn">
          <i class="el-icon-error animated zoomIn" @click.stop="closeBigImg"></i>

        </div>
      </el-dialog> -->
    </el-drawer>
  </div>
</template>
<script>
const token = window.sessionStorage.getItem("user-token");
const listInfo = window.sessionStorage.getItem("listInfo");
export default {
  data() {
    return {
      drawer: false,
      productList: [],
      orderList: [],
      img: "",
      bigImg: { hide: true, show: false },
      bigShows: false,
      size: "100%",
      token: token,
      arr: [],
      totalprice: 0,
      listInfo: listInfo,
    };
  },
  computed: {},
  created() {
    this.getList();
    // this.$request.get("/api/xwProduct/back", { state: 0, sort: "sort,desc" }).then(res =>{
    //   debugger
    //   console.log('vvvvvvvvvvvvv',res)
    // });
    // console.log("00000000000", this.$request.a);
  },
  mounted() {
    window.addEventListener("mousewheel", this.handleScroll, false);
  },
  methods: {
    // 列表图片放大
    big(imgurl, e) {
      this.img = `${imgurl}_resize_?w=1000&h=1000`;
      this.bigShows = true;
      this.bigImg.show = true;
      this.bigImg.hide = false;
      // var intX = window.event.clientX;
      // var intY = window.event.clientY;
      // var allH = document.body.clientHeight;
      // var allW = document.body.clientHeight;
      // console.log("allh", allH, intY);
      // if (intY + 380 >= allH) {
      //   this.$refs.bigImg.style.left = intX - 150 < 0 ? 0 : intX - 150 + "px";
      //   this.$refs.bigImg.style.top = intY - 300 + "px";
      // } else if (intY + 380 >= allH && ntX + 500 >= allW) {
      //   this.$refs.bigImg.style.left = intX - 500 + "px";
      //   this.$refs.bigImg.style.top = intY - 300 + "px";
      // } else if (intX + 500 >= allW) {
      //   this.$refs.bigImg.style.left = intX - 500 + "px";
      //   this.$refs.bigImg.style.top = intY - 150 < 0 ? 0 : intY - 150 + "px";
      // } else {
      //   // 设置大图左上角起点位置
      //   this.$refs.bigImg.style.left = intX - 150 < 0 ? 0 : intX - 150 + "px";
      //   this.$refs.bigImg.style.top = intY - 150 < 0 ? 0 : intY - 150 + "px";
      // }
    },
    // 列表图片缩小
    closeBigImg() {
      // // this.bigShows = false;
      this.bigImg.show = false;
      this.bigImg.hide = true;
    },

    handleScroll() {
      this.bigImg.show = false;
      this.bigImg.hide = true;
    },
    // 列表出现时，登录/注册页面消失。
    closePage() {
      this.size = "50%";
      this.$store.state.loginShow = false;
      this.$store.state.registerShow = false;
    },
    // 获取数据列表
    getList() {
      this.$axios({
        method: "GET",
        url: "/api/xwProduct/back",
        params: {
          state: 0,
          sort: "sort,desc",
        },
      })
        .then((res) => {

          this.productList = res.data.content;
          console.log('666',res)
          console.log("22444442", this.productList);
          this.productList.forEach((item, index) => {
            this.orderList[index] = {
              productId: item.productId,
              price: 0,
              orderNumber: null,
              product: item,
            };
          });

          if (this.listInfo) {
            const info = JSON.parse(this.listInfo);
            info.forEach((item, index) => {
              this.orderList[index].orderNumber = item.orderNumber;
            });
          }

          console.log(this.productList, res);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onSubmit() {
      console.log("...", this.orderList);
      const a = this.orderList.filter((item) => {
        return item.orderNumber;
      });
      console.log(a);
      var prolist = JSON.stringify(a);
      window.sessionStorage.setItem("listInfo", prolist);
      if (!this.token) {
        this.$message.error("请登录！");
        this.$router.push("/login");
        this.$store.state.loginShow = true;
        this.drawer = false;
      }
      if (a.length === 0 && this.token) {
        this.$message.error("错误，订单不能为空");
      } else {
        this.$router.push("/order");
        this.drawer = false;
      }
    },
    add() {
      this.drawer = true;
      this.size = "50%";
      // this.$router.push('/')
      // this.getList()
    },
    endPrice(productPrices, index) {
      if (productPrices.length > 1) {
        for (var i = 0; i < productPrices.length; i++) {
          if (
            this.orderList[index].orderNumber >=
              productPrices[i].productNumber &&
            this.orderList[index].orderNumber <
              productPrices[i + 1].productNumber
          ) {
            return productPrices[i].price;
          } else if (
            this.orderList[index].orderNumber >=
            productPrices[productPrices.length - 1].productNumber
          ) {
            return productPrices[productPrices.length - 1].price;
          }
        }
      }
      return productPrices[0].price;
    },
    showImg(imgurl, e) {
      this.img = `${imgurl}_resize_?w=1000&h=1000`;
      this.bigImg.show = true;
      this.bigImg.hide = false;
      var intX = window.event.clientX;
      var intY = window.event.clientY;
      var allH = document.body.clientHeight;
      console.log("allh", allH);
      // 设置大图左上角起点位置
      this.$refs.bigImg.style.left = intX - 150 < 0 ? 0 : intX - 150 + "px";
      this.$refs.bigImg.style.top = intY - 150 < 0 ? 0 : intY - 150 + "px";
    },
    hideImg(e) {
      this.bigImg.show = false;
      this.bigImg.hide = true;
    },
    closeDrawer() {
      this.$store.state.loginShow = false;
      this.$store.state.registerShow = false;
      this.drawer = false;
      // this.size = "20%";
    },
  },
};
</script>
<style scoped lang="less">
.container {
  background: #f5f5f5;
  margin-right: 10px;
  padding-top: 10px;
  border-radius: 5px;
  transition: 0.65s;
  &:hover {
    transform: translateZ(60deg);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
}

.mengceng {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background-color: rgba(128, 128, 128, 0.7);
}
.bigImgs {
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  i {
    z-index: 999;
    transition: 1s;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 35px;
    color: #ffcc00;
  }
}
.box {
  overflow: hidden;
  position: relative;
}
.followm {
  width: 500px;
  border-radius: 5px;
}
.hide {
  display: none;
}
.img_box {
  width: 100%;
  .imgs {
    width: 100%;
  }
}
.show {
  position: fixed;
  // pointer-events: none;

  display: block;
}
/deep/ .el-drawer {
  //  background:rgba(224, 230, 235,0.8);
  background: linear-gradient(to bottom, #ccc, #e2e2e2, #f7f7f7);
  overflow: scroll;
}

/deep/ .el-card__body {
  padding: 10px;
}
.left {
  width: 158px;
  display: inline-block;
  overflow: hidden;
  // border-radius: 50%;
  img {
    display: block;
    width: 100%;
    transition: 0.65s;
  }
  .tile {
    height: 40px;
    background-color: #fff;
    text-align: center;
    line-height: 40px;
  }

  // &:hover img{
  //   transform: scale(2);
  // }
  // &:hover .right{
  //   display: block;
  //   background: rgba(0, 0, 0, .8);
  // }
}
.right {
  transition: 0.65s;
  // border-radius: 50%;
  // position: absolute;
  display: inline-block;
  // height: 100%;
  // top: 0;
  line-height: 35px;
  height: 35px;
  width: 100%;
  // display: none;
  // border-left: 1px solid #a9b0b9;
  vertical-align: bottom;
  text-align: center;
  // padding-top: 20px;
  box-sizing: border-box;
  background-color: #fff;
  // line-height: 2;
  p {
    color: #fff;
    font-size: 25px;
    width: 100%;
    text-align: centera;
  }
  .iconfont {
    position: absolute;
    left: 10px;
  }
}

.imgbox {
  width: 100%;
  position: relative;
  height: 106px;
  overflow: hidden;
  .icon-icon {
    position: absolute;
    /* z-index: 99; */
    right: 0;
    bottom: 4px;
    color: #fff;
    font-size: 20px;
  }
  .img {
    position: absolute;
    width: 100%;
    vertical-align: bottom;
  }
}

.orderText {
  color: #666;
  text-align: left;
  // overflow: hidden;
  p {
    width: 100%;
    white-space: nowrap;
    margin: 5px 0px;
    font-size: 13px;
    overflow: hidden;
    height: 18px;
    color: #000;
    text-overflow: ellipsis;
  }
  input {
    border-radius: 5px;
    margin-top: 7px;
    background-color: transparent;
    // border-radius: 10px;
    outline: none;
    border: 1px solid #666;
    width: 60%;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    text-align: center;
    padding: 0;
    margin: 0;
  }
}
.el-row {
  margin-top: 20px;
  margin-left: 125px;
  padding: 0 90px;
  height: 100vh;
}
.el-col {
  margin-bottom: 20px;
}
.prolist {
  position: fixed;
  right: 0;
  bottom: 34px;
}

.foot {
  width: 100%;
  background-color: #f0f3f5;
  height: 125px;
  text-align: center;
  padding-top: 30px;
  position: fixed;
  bottom: 0;
  .btn {
    width: 325px;
    height: 46px;
    outline: none;
    border: none;
    background-color: #fff;
    color: #0758d8;
    border-radius: 23px;
    font-size: 20px;
  }
}
.tright {
  width: 80px;
  height: 40px;
  // background-color: #fff;
  background: #7459dc;
  color: #fff;
  margin-bottom: 10px;
  border-radius: 25px;
  text-align: center;
  padding-top: 5px;

  .icon-shouqi2 {
    font-size: 20px;
  }
}
.trBtn {
  position: fixed;
  bottom: 0;
  right: 0;
}
.subBtn {
  border: none;
  // background-color: #fff;
  color: #fff;
  background: #41b3ff;
  border-radius: 25px;
  margin-bottom: 10px;
  width: 80px;
  font-size: 14px;
  text-align: center;
  // border-top: 1px solid #666;
  height: 40px;
  font-weight: 700;
  outline: none;
  // color: #666;
}

//去除input type=number 的默认样式
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
