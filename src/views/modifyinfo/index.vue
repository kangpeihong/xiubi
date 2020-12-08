<template>
  <div>
      <el-card class="register">

        <div slot="header" class="clearfix">
            <span>修改发票信息</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click.native="onCancel ">关闭</el-button>
        </div>
        <el-form :model="info" ref="form" label-width="80px"  >
        <!-- <el-form-item prop="enterpriseCode" label="企业编号"
            v-show=" active === 0">
          <el-input v-model="info.enterpriseCode" :disabled="!vsb"></el-input>
        </el-form-item> -->
        <!-- <el-form-item ref="loginphone" prop="loginPhone" label="手机号"
            :rules="[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {pattern: /^1[34578]\d{9}$/, message: '电话号输入有误'}
                    ]">
          <el-input v-model="info.loginPhone" :disabled="!vsb"></el-input>
        </el-form-item>
        <el-form-item  label="验证码"
            :rules="[
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]">
          <el-input v-model="vcode" :disabled="!vsb" class="vcode" ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码"
            :rules="[
                    { required: true, message: '请输入密码', trigger: 'blur' }

                    ]">
          <el-input v-model="info.password" :disabled="!vsb"></el-input>
        </el-form-item> -->

        <!-- <el-form-item prop="enterpriseCode" label="企业编号"
            v-show=" active === 0">
          <el-input v-model="info.enterpriseCode" :disabled="!vsb"></el-input>
        </el-form-item> -->
        <el-form-item prop="enterpriseName" label="企业名称"
            :rules="[
                    { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ]">
          <el-input v-model="info.enterpriseName" ></el-input>
        </el-form-item>
        <el-form-item prop="creditCode" label="信用代码"
            :rules="[
                    { required: true, message: '请输入信用代码', trigger: 'blur' }
                    ]">
          <el-input v-model="info.creditCode" ></el-input>
        </el-form-item>
        <el-form-item prop="registeredAddress" label="注册地址"
            :rules="[
                    { required: true, message: '请输入注册地址', trigger: 'blur' }

                    ]">
          <el-input v-model="info.registeredAddress" ></el-input>
        </el-form-item>
        <el-form-item prop="phoneNumber" label="注册电话"
            :rules="[
                    { required: true, message: '请输入注册电话', trigger: 'blur' },
                    {pattern: /^1[34578]\d{9}$/, message: '电话号输入有误'}
                    ]">
          <el-input v-model="info.phoneNumber" ></el-input>
        </el-form-item>

        <el-form-item prop="accountOpening" label="开户行"
            :rules="[
                    { required: true, message: '请输入开户行', trigger: 'blur' }
                    ]">
          <el-input v-model="info.accountOpening"></el-input>
        </el-form-item>
        <el-form-item prop="bankAccount" label="银行账号"
            :rules="[
                    { required: true, message: '请输入银行账号', trigger: 'blur' }
                    ]">
          <el-input v-model="info.bankAccount"></el-input>
        </el-form-item>

        <!-- <el-form-item prop="consignee" label="收货人"
            :rules="[
                    {required: true,message: '请输入收货人名称',trigger: 'blur'}

                    ]">
          <el-input v-model="info.consignee"></el-input>
        </el-form-item> -->
        <!-- <el-form-item prop="telephone" label="收货电话"
            :rules="[
                     { required: true, message: '请输入注册电话', trigger: 'blur' },
                    {pattern: /^1[34578]\d{9}$/, message: '电话号输入有误'}
                    ]">
          <el-input v-model="info.telephone"></el-input>
        </el-form-item>
        <el-form-item prop="harvestAddress" label="收货地址"
            :rules="[
                     { required: true, message: '请输入收货地址', trigger: 'blur' },

                    ]">
          <el-input v-model="info.harvestAddress"></el-input>
        </el-form-item> -->

        <el-form-item >
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
  data () {
    return {

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
      }

    }
  },
  created () {
    this.info = info.xwEnterpriseDTO
  },
  methods: {
    onSubmit () {
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
    onCancel () {
      this.$router.push('/order')
    }
  }
}
</script>

<style>
.register{
        height: 550px;
        width: 400px;
        position:absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
        /* padding-right: 40px; */
    }
</style>
