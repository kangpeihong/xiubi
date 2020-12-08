<template>
  <div id="app">
    <div class="login" v-if="show">
      <!-- <router-link to="/login"  @click="loginUser">登录</router-link> <span class="sbox"></span>
       -->
      <!-- <router-link to="/register">注册</router-link> -->

      <span @click="loginUser">登录</span><span class="sbox"></span>
      <span @click="register">注册</span>
    </div>
    <div class="login" v-if="!show">

      <el-avatar :size='25' src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'> </el-avatar>
      <span class="sbox"></span>

      <el-dropdown>
        <span class="userinfo">{{userinfo}}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="history">历史订单</el-dropdown-item>
          <el-dropdown-item @click.native="modifyPass">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="hpicture">
      <div v-for="(item,index) in userArr" :key="item.id" class="user-head" :class="index===currentNum ? 'active' : ''" @mouseenter="currentInfo(index)" @mouseleave="hide()">
        <img :src='item.headAddress' alt="">
        <div v-show="ifToken">
          <p>{{item.name}}</p>
          <p>{{item.jobs}}</p>
          <p style="font-family: HeiTi">{{item.phone}}</p>
        </div>
      </div>

    </div>
    <router-view />
    <prolist v-on:open-list="this.$router.push('/')"></prolist>
    <img src="./assets/images/logoo.png" alt="" class="logo">
    <!-- <div class="info">
      <h4>北京·密云</h4>
      <p>北京修文印刷技术有限公司</p>
      <p>单色印刷车间</p>
      <p>孙恒文<i class="el-icon-arrow-down el-icon--right"></i></p>
      <p>{{time}}</p>
      <div style="display:none">
        <p>机长,企业投资人,生产主管</p>
      <p>手机:18911629068</p>
      <p>微信:18911629068</p>
      <p>QQ:583895185</p>
      </div>
    </div> -->
    <div class="player">
      <div class="prism-player" id="player-con">

      </div>

    </div>

  </div>
</template>
<script type="text/javascript" charset="utf-8" src="https://g.alicdn.com/de/prismplayer/2.9.0/aliplayer-min.js"></script>

<script>
import Bus from "./utils/bus.js";
import prolist from "./views/productList";
export default {
  data() {
    return {
      videoUrl: "./playVideo/video.html",
      userinfo: "",
      userArr: [
        // {
        //   img: require('./assets/images/mersi.jpg'),
        //   name: '里奥梅西',
        //   part: '运营实施',
        //   phoneNum: 17611301761
        // },
        // {
        //   img: require('./assets/images/suyaleis.jpg'),
        //   name: '苏亚雷斯',
        //   part: '美工修图',
        //   phoneNum: 17611301761
        // },
        // {
        //   img: require('./assets/images/nmr.jpg'),
        //   name: '内马尔',
        //   part: '打包发货',
        //   phoneNum: 17611301761
        // }
      ],
      currentNum: null,
      show: true,

      video: {
        id: "player-con",
        source: "",
        width: "100%",
        height: "100vh",
        autoplay: true,
        isLive: false,
        rePlay: false,
        showBuffer: true,
        snapshot: false,
        showBarTime:'5000',
        useFlashPrism: true,
        skinLayout: [
          {
            name: "controlBar",
            align: "blabs",
            x: 0,
            y: 0,
            children: [],
          },
          {
            name: "fullControlBar",
            align: "tlabs",
            x: 0,
            y: 0,
            children: [],
          },
        ],
        playsinline: true,
        preload: true,
        controlBarVisibility: "hover",
        useH5Prism: true,
      },
      ifToken: false,
    };
  },
  components: {
    prolist,
  },

  methods: {
    history() {
      this.$router.push("./historyPage");
    },
    loginUser() {
      this.$router.push("./views/login/index").catch(() => {});
      this.$store.state.loginShow = true;
    },
    register() {
      this.$router.push("/register").catch(() => {});
      this.$store.state.registerShow = true;
    },
    // getUrl () {
    //   this.$axios
    //     .post(
    //       'https://open.ys7.com/api/lapp/token/get?appKey=e91574b23c344e858ab96f8d60294ae9&appSecret=ca09a52e43fcebae1a1819676b80250c',
    //       {
    //         headers: {}
    //       }
    //     )
    //     .then(res => {
    //       console.log(res, 1)
    //       this.accessToken = res.data.accessToken
    //       this.videoUrl =
    //         'https://open.ys7.com/ezopen/h5/iframe?url=ezopen://EXPRVK@open.ys7.com/D44345285/1.hd.live&autoplay=1&accessToken=' +
    //         res.data.data.accessToken
    //     })
    //     .catch(err => {
    //       console.log(err, '请求失败')
    //     })
    // },
    //修改密码
    modifyPass() {
      this.$router.push("/modify");
    },
    getinfo() {
      const token = JSON.parse(window.sessionStorage.getItem("user-token"));
      if (token) {
        this.show = false;
        this.userinfo = token.xwEnterpriseDTO.consignee;
      }
    },
    loginOut() {
      this.$confirm("确定要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.sessionStorage.removeItem("user-token");
          window.sessionStorage.removeItem("listInfo");
          window.location.reload();
        })
        .catch(() => {});
    },
    getOrder() {
      this.$router.push("/order");
    },
    // 获取员工信息
    getparter() {
      this.$axios({
        method: "get",
        url: "/api/xwEmployees/back",
        params: {
          sort: "sort,asc",
        },
      })
        .then((res) => {
          this.userArr = res.data.content;
        })
        .catch((err) => {
          console.log(11111111, err);
        });
    },
    currentInfo(index) {
      if (this.currentNum !== index) {
        this.currentNum = index;
      }
    },
    hide() {
      this.currentNum = null;
    },
    getplay() {
      this.$axios({
        method: "get",
        url: "/api/room/1001",
      }).then((res) => {
        this.video.source = res.data.roomAddress + res.data.roomNo;
        console.log("112", this.video.source);
        var player = new Aliplayer(this.video, function (player) {
          console.log("The player is created");
        });
      });
    },
  },
  created() {
    // this.getUrl()
    this.getinfo();
    Bus.$on("change", (e) => {
      this.userinfo = e.consignee;
    });
  },
  mounted() {
    this.getparter(), this.getplay();
    let token = sessionStorage.getItem("user-token");

    if (token !== "" && token !== null) {
      this.ifToken = true;
    } else {
      this.ifToken = false;
    }
  },
};
</script>
<style lang="less" socped>
html {
  -moz-user-select: none; /* Firefox私有属性 */
  -webkit-user-select: none; /* WebKit内核私有属性 */
  -ms-user-select: none; /* IE私有属性(IE10及以后) */
  -khtml-user-select: none; /* KHTML内核私有属性 */
  -o-user-select: none; /* Opera私有属性 */
  user-select: none; /* CSS3属性 */
}
// .box{
//   background-image: url('./assets/images/backgrounD.jpg');
//     background-size:cover;
//     height: 100vh;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// }
@import "https://g.alicdn.com/de/prismplayer/2.9.0/skins/default/aliplayer-min.css";
body {
  position: relative;
}
.player {
  width: 100%;
  height: 100vh;
  *zoom: 1;
  position: relative;
  z-index: -1;
}
::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

.logo {
  position: absolute;
  left: 40px;
  top: 10px;
  height: 70px;
}
.login {
  height: 40px;
  position: absolute;
  top: 10px;
  right: 20px;
  color: #fff;
  font-size: 15px;
  .userinfo {
    display: inline-block;

    transform: translate(0, -7px);
    color: #fff;
  }
}
.sbox {
  display: inline-block;
  width: 10px;
}

//头像
.hpicture {
  position: absolute;
  left: 50px;
  top: 100px;
  color: #fff;
  img {
    width: 60px;
    border-radius: 50%;
    margin-bottom: 30px;
  }
  p {
    display: none;
  }
}
.user-head {
  overflow: hidden;
  min-height: 95px;
}
.active {
  img {
    transform: scale(2);
    position: absolute;
    z-index: 10;
    transition: 0.8s;
  }
  div {
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin-bottom: 30px;
    padding-left: 15px;
    // padding-top: 5px;
    transition: 0.4s;

    p {
      display: block;
      margin: 10px;
      background: rgba(255, 255, 255, 0.2);
      padding-left: 120px;
      padding-right: 20px;
      font-family: YouYuan;
      font-size: 15px;
      height: 20px;
      transition: 0.4s;
    }
    :last-child {
      font-family: ITC Avant Garde Gothic Std Book;
    }
  }
}
</style>
