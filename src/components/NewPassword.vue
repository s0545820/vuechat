<template>
  <div id="outerdiv" class="yellow">
    <form @submit="submitForm">
      <div class="row padded">
        <div class="input-field col s12 m6 l6 offset-l3 offset-m3">
          <input id="password" name="password" type="password" v-model="password" v-validate="'required'">
          <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
          <label for="password">New Password</label>
        </div>
        <div class="input-field col s12 m6 l6 offset-l3 offset-m3">
          <input id="passwordConfirm" name="passwordConfirm" type="password" v-model="confirmPassword" v-validate="'required|confirmed:password'">
          <span v-show="errors.has('passwordConfirm')" class="text-danger">{{ errors.first('passwordConfirm') }}</span>
          <label for="passwordConfirm">Confirm Password</label>
        </div>
        <div class="row">
          <div class="col s8 m3 l2 offset-l5 offset-m5 offset-s2">
            <button type="submit" class="btn">Change</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import router from '../router/index'
export default {
  name: 'newpassword',
  data () {
    return {
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
      submitForm: function(ev) {
        ev.preventDefault();
        var self = this;
        this.$validator.validateAll().then((result) => {
          if (result) {
            $.post("http://localhost:3000/api/reset/", {token: self.$route.params.token, password: self.password}, function(result){
              router.push('/');
              Materialize.toast('Your password has been changed.',4000);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 404) {
                  router.push('/retrievePassword');
                  Materialize.toast('Token was already used or is malformed.',4000);
                } else if(jqXHR.status == 410) {
                  router.push('/retrievePassword');
                  Materialize.toast('Your password reset token has expired. \n Please request a new one.',4000);
                } else {
                  router.push('/retrievePasword');
                  Materialize.toast('Something went wrong. Please try again.',4000);
                }
            });
          }
        });
      }
    },
    created: function() {
      if(localStorage.getItem('jwt_token')) {
        if(jwt_decode(localStorage.getItem('jwt_token')).exp*1000 > Date.now()) {
          router.push('/profile');
        }
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#outerdiv {
  height: 100vh;
}
.row.padded {
  padding-top: 100px;
}
.btn {
  width: 100%;
  background-color: #90a4ae;
}
.btn:hover {
  background-color: #546e7a;
}
</style>
