<template>
  <div class="container yellow">
      <!--<div class="info" v-if="isVerified">
        <p>Thank you for verificating your email. You can now go to your
          <router-link class="btn" to="/profile">profile</router-link>
        </p>
      </div>
      <div class="info" v-if="error">
        <p>Please request another verification email in your
           <router-link class="btn" to="/profile">profile</router-link>
        </p>
      </div>
      <div class="info" v-if="expired">
        <p>Your Verification token has expired. Please request another verification email in your
           <router-link class="btn" to="/profile">profile</router-link>
        </p>
      </div>-->
  </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import router from '../router/index';
export default {
  name: 'verification',
  data () {
    return {

    }
  },
  methods: {
  },
  created: function () {
    var self = this;
    var token = this.$route.params.token;
    $.post("http://localhost:3000/api/verify/" + token, function(result){
      self.isVerified = true;
      if(localStorage['user']) {
        var user = JSON.parse(localStorage['user']);
        user.isVerified = true;
        localStorage['user'] = JSON.stringify(user);
      }
      Materialize.toast('Your Account has been verified!',4000);
      router.push('/profile');
    }).fail(function(jqXHR, textStatus, errorThrown) {
        if(jqXHR.status == 409) {
          self.error = true;
          Materialize.toast('This account is already verified or the token is not valid.',4000);
        } else if(jqXHR.status == 410) {
          self.expired = true;
          Materialize.toast('Your verification token has expired. Please request another verification email.',4000);
        } else {
          self.error = true;
          Materialize.toast('Something went wrong. Please request another verification email.',4000);
        }
        router.push('/profile');
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.info {
  position: relative;
  top: 50%;
  margin:auto;
  color: black;
  text-align: center;
}
.btn-large {
  background-color: rgba(0,0,0,0);
  border-radius: 4px;
  box-shadow: none;
  border: 2px solid black;
  color: black;
  margin-top:0;
}
.btn-large:hover {
  -webkit-box-shadow: 0px 6px 18px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 6px 18px 0px rgba(0,0,0,0.75);
  box-shadow: 0px 6px 18px 0px rgba(0,0,0,0.75);
}

.container {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  height: 100vh;
}

p {
  margin: 0;
}

</style>
