<template>
  <div id="container" class="yellow">
    <div class="row">
      <div class="col s12 m12 l12 halfheight">
        <h2><p>Join our Chat</p> and meet new people! </h2>
      </div>
    </div>

    <div v-if="!auth" class="row" id="forms">
      <form v-on:submit="signUp">
        <div id="signup" class="col s12 col m6 offset-m3"><!--Signup Form-->
          <div class="row">
            <div class="input-field col s10 offset-s1">
              <input id="username" name="username" type="text" v-model="credentials.username" required>
              <label for="username">Username</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s10 offset-s1">
              <input id="email" name="email" type="email" v-model="credentials.email" required>
              <label for="username">Email</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s10 offset-s1">
              <input id="password" name="password" type="password" v-model="credentials.password" required>
              <label for="username">Password</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s10 offset-s1">
              <input id="passwordConfirm" name="passwordConfirm" type="password" v-model="passwordconfirm" required>
              <label for="username">Confirm Password</label>
            </div>
          </div>
          <div class="row">
            <div class="col s10 m10 l4 offset-s1 offset-m1 offset-l4">
              <button id="submit" name="submit" type="submit" class="btn join">Join Now!</button>
            </div>
          </div>
        </div>
      </form>
      <div id="login">
        <form v-on:submit="logIn">
          <div class="col s10 m8 l6 offset-s1 offset-m2 offset-l3"><!--Login Form-->
            <div class="row">
              <div class="input-field">
                <input id="l_username" name="l_username" type="text" v-model="logincreds.username" required>
                <label for="l_username">Username</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field">
                <input id="l_password" name="l_password" type="password" v-model="logincreds.password" required>
                <label for="l_password">Password</label>
              </div>
            </div>
            <div class="row">
              <div class="">
                <button id="l_submit" name="submit" type="submit" class="btn">Log In</button>
              </div>
            </div>
          </div>
        </form>
        <div class="row">
          <div class="col s10 m8 l6 offset-s1 offset-m2 offset-l3">
            <div class="col s6 m6 l6">
              <button class="btn smalltext" id="toggle">Need an account?</button>
            </div>
            <div class="col s6 m6 l6">
              <router-link to="retrievePassword" class="btn smalltext">Forgot password?</router-link>
            </div>
          </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script>
$(document).ready(function(){
  $("#toggle").click(function(){
    $("#login, #signup").toggle("slow");
  });
});
import axios from 'axios';
import router from '../router/index';
import jwt_decode from 'jwt-decode';

export default {
  name: 'home',
  data () {
    return {
      passwordconfirm: '',
      credentials: {
        username: '',
        email: '',
        password: ''
      },
      passwordconfirm: '',
      logincreds: {
        username: '',
        password: ''
      },
      auth: false
    }
  },
  methods: {
    signUp: function(ev) {
      ev.preventDefault();
      if(this.passwordconfirm == this.credentials.password) {
        var newUser = {
          username: this.credentials.username,
          email: this.credentials.email,
          password: this.credentials.password,
        };
        $.post("http://localhost:3000/api/register", newUser, function(result){
          localStorage.setItem('jwt_token', result.jwt_token);
          localStorage.setItem('refresh_token', result.refresh_token);
          var user = {
            username: jwt_decode(localStorage.getItem('jwt_token')).username,
            email: jwt_decode(localStorage.getItem('jwt_token')).email,
            isVerified: jwt_decode(localStorage.getItem('jwt_token')).isVerified
          }
          localStorage.setItem('user', JSON.stringify(user));
          router.push('/profile');
        });
      } else {
        Materialize.toast('Passwords do not match',4000);
      }
    },
    logIn: function(ev) {
      ev.preventDefault();
      var user = {
        username: this.logincreds.username,
        password: this.logincreds.password
      };
            $.post("http://localhost:3000/api/login", user, function(result){
              localStorage.setItem('jwt_token', result.jwt_token);
              localStorage.setItem('refresh_token', result.refresh_token);
              var user = {
                username: jwt_decode(localStorage.getItem('jwt_token')).username,
                email: jwt_decode(localStorage.getItem('jwt_token')).email,
                isVerified: jwt_decode(localStorage.getItem('jwt_token')).isVerified
              }
              localStorage.setItem('user', JSON.stringify(user));
              router.push('/profile');
            });
    }
  },
  created: function() {
    if(jwt_decode(localStorage.getItem('jwt_token')).exp*1000 > Date.now()) {
      this.auth = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  text-align: center;
  height: 100vh;
  max-width: 100%;
}

.input-field label {
  color: #90a4ae;
  font-weight: bold;

}

@-webkit-keyframes autofill {
    to {
        color: #546e7a;
        background: transparent;
    }
}

input:-webkit-autofill {
    -webkit-animation-name: autofill;
    -webkit-animation-fill-mode: both;
}

.input-field input[type]:focus + label {
  color: #546e7a;
}
.input-field input[type]:focus {
  border-bottom: 1px solid #546e7a;
  box-shadow: 0 1px 0 0 #546e7a;
}
h2 {
  text-shadow: 3px 2px 2px rgba(93, 98, 98, 1);
  letter-spacing: 3px;
  color: white;
}
#submit, #l_submit {
  background-color: #90a4ae;
  width:100%;
}
#submit:hover, #l_submit:hover {
  background-color: #546e7a;
}

#signup {
  display: none;
}
#signup input{
  margin-bottom: 0px;
}
#toggle {
  width: 100%;
}

.btn.smalltext {
  background-color: rgba(255,255,255,0.4);
  font-size: 0.60em;
  color: #546e7a;
  width:100%;
}
.btn.smalltext:hover {
  background-color: rgba(255,255,255,0.2);
}
#signup > .row {
  margin-bottom: 10px;
}
.text-danger {
  color: red;
}

</style>
