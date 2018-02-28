<template>
  <div id="outerdiv" class="yellow">
    <form @submit="submitForm">
      <div class="row padded">
        <div class="input-field col s12 m6 l6 offset-l3 offset-m3">
          <input id="password" name="password" type="password" v-model="password" required>
          <label for="password">New Password</label>
        </div>
        <div class="input-field col s12 m6 l6 offset-l3 offset-m3">
          <input id="passwordConfirm" name="passwordConfirm" type="password" v-model="confirmPassword" required>
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
        var token = this.$route.params.token;
        $.post("http://localhost:3000/api/reset/", token, function(result){
          if(result.expired) {
            Materialize.toast('Your token has expired', 4000);
            router.push('/retrievePassword');
          } else if(result.error) {
            Materialize.toast('Internal Error. Please try again.', 4000);
            router.push('/retrievePassword');
          } else if(result.success) {
            Materialize.toast('Your Password has been changed', 4000);
            //router.push('/');
          }
        });
        //router.push('/');
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
}

</style>
