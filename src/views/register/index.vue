<template>
  <div >
      <el-card class="register animated fadeIn" v-if="registerShow">
        <el-steps :space="110" :active="this.$route.query.userId ? 2 :active" finish-status="success" :align-center="true"  class="title">
          <el-step title="用戶信息"></el-step>
          <el-step title="企业信息"></el-step>
          <el-step title="汇款信息"></el-step>
          <el-step title="收货信息"></el-step>
        </el-steps>
        <i class="el-icon-close clbtn" @click="goback"></i>
        <el-form :model="info" ref="form0" label-width="100px"  >
        <!-- <el-form-item prop="enterpriseCode" label="企业编号"
            v-show=" active === 0">
          <el-input v-model="info.enterpriseCode" :disabled="!vsb"></el-input>
        </el-form-item> -->
        <el-form-item ref="loginphone" prop="loginPhone" label="手机号" v-show=" active === 0"
            :rules="[
                    { required: true, message: '请输入手机号', trigger: 'change' },
                    {pattern: /^1[34578]\d{9}$/, message: '电话号输入有误'}
                    ]">
          <el-input v-model="info.loginPhone" :disabled="!vsb"></el-input>
        </el-form-item>
        <el-form-item  label="验证码" v-show=" active === 0"
            :rules="[
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]">
          <el-input v-model="vcode" :disabled="!vsb" class="vcode" ></el-input>
          <el-button @click="sendCode" :disabled=isDisabled  >{{buttonName}}</el-button>
        </el-form-item>
        <el-form-item prop="password" label="密码" v-show=" active === 0"
            :rules="[
                    { required: true, message: '请输入密码', trigger: 'blur' }

                    ]">
          <el-input v-model="info.password" :disabled="!vsb"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="info" ref="form1" label-width="100px"  >
        <!-- <el-form-item prop="enterpriseCode" label="企业编号"
            v-show=" active === 0">
          <el-input v-model="info.enterpriseCode" :disabled="!vsb"></el-input>
        </el-form-item> -->
        <el-form-item prop="enterpriseName" label="企业名称" v-show=" active === 1"
            :rules="[
                    { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ]">
          <el-input v-model="info.enterpriseName" :disabled="!vsb"></el-input>
        </el-form-item>
        <el-form-item prop="creditCode" label="信用代码" v-show=" active === 1"
            :rules="[
                    { required: true, message: '请输入信用代码', trigger: 'blur' }
                    ]">
          <el-input v-model="info.creditCode" :disabled="!vsb"></el-input>
        </el-form-item>
        <el-form-item prop="registeredAddress" label="注册地址" v-show=" active === 1"
            :rules="[
                    { required: true, message: '请输入注册地址', trigger: 'blur' }

                    ]">
          <el-input v-model="info.registeredAddress" :disabled="!vsb"></el-input>
        </el-form-item>
        <el-form-item prop="phoneNumber" label="注册电话" v-show=" active === 1"
            :rules="[
                    { required: true, message: '请输入注册电话', trigger: 'blur' },
                    {pattern: /^1[34578]\d{9}$/, message: '电话号输入有误'}
                    ]">
          <el-input v-model="info.phoneNumber" :disabled="!vsb"></el-input>
        </el-form-item>

      </el-form>
      <el-form :model="info" ref="form2" label-width="100px"  >

        <el-form-item prop="accountOpening" label="开户行" v-show=" active === 2"
            :rules="[
                    { required: true, message: '请输入开户行', trigger: 'blur' }
                    ]">
          <el-input v-model="info.accountOpening"></el-input>
        </el-form-item>
        <el-form-item prop="bankAccount" label="银行账号" v-show=" active === 2"
            :rules="[
                    { required: true, message: '请输入银行账号', trigger: 'blur' }
                    ]">
          <el-input v-model="info.bankAccount"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="info" ref="form3" label-width="100px"  >

        <el-form-item prop="consignee" label="收货人" v-show=" active === 3"
            :rules="[
                    {required: true,message: '请输入收货人名称',trigger: 'blur'}

                    ]">
          <el-input v-model="info.consignee"></el-input>
        </el-form-item>
        <el-form-item prop="telephone" label="收货电话" v-show=" active === 3"
            :rules="[
                     { required: true, message: '请输入注册电话', trigger: 'blur' },
                    {pattern: /^1[34578]\d{9}$/, message: '电话号输入有误'}
                    ]">
          <el-input v-model="info.telephone"></el-input>
        </el-form-item>
        <el-form-item prop="harvestAddress" label="收货地址" v-show=" active === 3"
            :rules="[
                     { required: true, message: '请输入收货地址', trigger: 'blur' },

                    ]">
          <el-input v-model="info.harvestAddress"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  @click="next" v-show="active !== 3">下一步</el-button>
        </el-form-item>
        <el-form-item v-if="vsb" v-show="active === 3">
          <el-button type="primary" @click="onSubmit" class="resbutton">立即注册</el-button>
        </el-form-item>
        <el-form-item v-if='!vsb' v-show="active === 3">
          <el-button type="primary" @click="onSubmit" >立即修改</el-button>
         <el-button @click="onCancel">取消修改</el-button>
        </el-form-item>
      </el-form>
      </el-card>

  </div>
</template>

<script>
import Bus from '../../utils/bus.js'
const info = JSON.parse(window.sessionStorage.getItem('user-token'))
export default {

  name: 'register',
  data () {
    return {
      buttonName: '发送验证码',
      isDisabled: false,
      time: 60,
      vcode: '',
      info: {
        loginPhone: '',
        password: '',
        accountOpening: '',
        bankAccount: '',
        consignee: '',
        creditCode: '',
        enterpriseName: '',
        harvestAddress: '',
        phoneNumber: '',
        registeredAddress: '',
        telephone: ''
      },
      vsb: true,
      active: 0
    }
  },
  created () {
    if (this.$route.query.userId) {
      console.log(this.$route.query.userId)
      this.getinfo()
      this.vsb = false
      this.active = 2
    }
  },
  computed:{
    registerShow(){
      return this.$store.state.registerShow;
    }
  },
  methods: {
    register () {
      this.$refs.form3.validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: '/api/xwEnterprise',
            data: this.info
          }).then(res => {
            console.log(res)
            this.$router.push('/login')
            this.$notify({
              title: '提示',
              message: '注册成功请登录',
              duration: 0
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    change () {
      this.$axios({
        method: 'put',
        url: '/api/xwEnterprise',
        data: this.info
      }).then(res => {
        console.log(res)
        info.xwEnterpriseDTO = this.info
        window.sessionStorage.setItem('user-token', JSON.stringify(info))
        Bus.$emit('change', this.info)

        this.$router.push('/order')
      }).catch(err => {
        console.log(err)
      })
    },
    getinfo () {
      this.info = info.xwEnterpriseDTO
    },
    onSubmit () {
      if (this.$route.query.userId) {
        this.change()
      } else {
        this.register()
      }
    },
    onCancel () {
      this.$router.push('/order')
    },
    next () {
      if (this.active === 0) {
        this.$refs.form0.validate((valid) => {
          if (valid) {
            this.$axios({
              method: 'get',
              url: `api/xwEnterprise/create/${this.info.loginPhone}`
            }).then(res => {
              if (!res) {
                this.$axios({
                  method: 'post',
                  url: 'api/sms/test',
                  params: {
                    vcode: this.vcode,
                    phoneNumber: this.info.loginPhone

                  }
                }).then(res => {
                  if (res) {
                    this.active++
                  }
                }).catch(err => {
                  console.log(err)
                  this.$message('验证码有误')
                })
              } else {
                this.$message('此手机号已被注册')
              }
            })
          }
        })
      } else if (this.active === 1) {
        this.$refs.form1.validate((valid) => {
          if (valid) this.active++
        })
      } else if (this.active === 2) {
        this.$refs.form2.validate((valid) => {
          if (valid) this.active++
        })
      }
    },
    sendCode () {
      this.$refs.form0.validateField('loginPhone', valid => {
        if (!valid) {
          this.$axios({
            method: 'get',
            url: 'api/sms/send',
            params: {
              phoneNumber: this.info.loginPhone
            }
          })
          var me = this
          this.isDisabled = true
          var interval = window.setInterval(function () {
            me.buttonName = '已发送' + me.time
            --me.time
            if (me.time < 0) {
              me.buttonName = '重新发送'
              me.time = 60
              me.isDisabled = false
              window.clearInterval(interval)
            }
          }, 1000)
        }
      })
    },
    goback () {
      this.$router.replace('/')
    }
  }

}
</script>

<style lang="less" scoped>
    // .title{
    //   margin-left: 40px;
    // }
    .register{
        height: 450px;
        width: 450px;
        position:absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
        padding-right: 40px;
    }
    .resbutton{
      width: 150px;
      // margin-left: -60px;
    }
    .el-steps{
      margin-bottom: 50px;
    }
    .vcode{
      display: inline-block;
      width: 120px;
      margin-right: 25px;
    }
    .clbtn{
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 18px;
  z-index: 9;
}
</style>
