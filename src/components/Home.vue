<template>
  <div id="container">
    <div class="row">
      <div class="col s12 m12 l12 halfheight">
        <h2>Vuechat</h2>
        <h3>Start chatting right now!</h3>
      </div>
    </div>
    <div class="row" id="forms">
      <form v-on:submit="signUp">
        <div id="signup" class="col s12 col m6 offset-m3"><!--Signup Form-->
          <div class="row">
            <div class="input-field col s10 offset-s1">
              <input id="username" name="username" type="text" v-model="credentials.username" v-validate="'required|max:15'">
              <span v-show="errors.has('username')" class="text-danger">{{ errors.first('username') }}</span>
              <label for="username">Username</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s10 offset-s1">
              <input id="email" name="email" type="email" v-model="credentials.email" v-validate="'required|email'">
              <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>
              <label for="username">Email</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s10 offset-s1">
              <input id="password" name="password" type="password" v-model="credentials.password" v-validate="'required'">
              <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
              <label for="username">Password</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s10 offset-s1">
              <input id="passwordConfirm" name="passwordConfirm" type="password" v-model="passwordconfirm" v-validate="'required|confirmed:password'">
              <span v-show="errors.has('passwordConfirm')" class="text-danger">{{ errors.first('passwordConfirm') }}</span>
              <label for="username">Confirm Password</label>
            </div>
          </div>
          <div class="row">
            <div class="col s10 m10 l4 offset-s1 offset-m1 offset-l4">
              <button id="submit" name="submit" type="submit" class="btn">Join Now!</button>
            </div>
          </div>
        </div>
      </form>
      <div id="login">
        <form id="loginform" v-on:submit="logIn">
          <div class="col s10 m8 l6 offset-s1 offset-m2 offset-l3"><!--Login Form-->
            <div class="row">
              <div class="input-field">
                <input id="l_username" name="l_username" type="text" v-model="logincreds.username" v-validate="'required'">
                <span v-show="errors.has('l_username')" class="text-danger">{{ errors.first('l_username') }}</span>
                <label for="l_username">Username</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field">
                <input id="l_password" name="l_password" type="password" v-model="logincreds.password" v-validate="'required'">
                <span v-show="errors.has('l_password')" class="text-danger">{{ errors.first('l_password') }}</span>
                <label for="l_password">Password</label>
              </div>
            </div>
            <div class="row">
              <div class="col s12 m12 l10 offset-l1">
                <button id="l_submit" name="submit" type="submit" class="btn">Log In</button>
              </div>
            </div>
          </div>
        </form>
        <div class="row">
          <div class="col s10 m8 l6 offset-s1 offset-m2 offset-l3">
            <button id="fblog" class="btn col s10 m10 l6 offset-s1 offset-m1 offset-l3" @click="auth('facebook')">Login with Facebook</button>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m8 l6 offset-m2 offset-l3">
            <div class="col s6 m6 l6">
              <button class="btn smalltext" id="toggle" v-on:click="toggle">Need an account?</button>
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
      }
    }
  },
  methods: {
    toggle: function() {
        $("#login, #signup").toggle("slow");
    },
    signUp: function(ev) {
      ev.preventDefault();
      var self = this;
      this.$validator.validateAll(['username','email','password','passwordConfirm','gender']).then((result) => {
        if (result) {
          $.get( "https://dog.ceo/api/breeds/image/random", function( data ) {
            var newUser = {
              username: self.credentials.username,
              email: self.credentials.email,
              password: self.credentials.password,
              url: data.message

            };
            $.post("https://cryptic-savannah-75374.herokuapp.com/api/register", newUser, function(result){
              localStorage.setItem('jwt_token', result.jwt_token);
              localStorage.setItem('refresh_token', result.refresh_token);
              var user = {
                username: jwt_decode(localStorage.getItem('jwt_token')).username,
                email: jwt_decode(localStorage.getItem('jwt_token')).email,
                isVerified: jwt_decode(localStorage.getItem('jwt_token')).isVerified,
                user_id: jwt_decode(localStorage.getItem('jwt_token')).user_id,
                role: jwt_decode(localStorage.getItem('jwt_token')).role,
                banned: jwt_decode(localStorage.getItem('jwt_token')).banned,
                url: jwt_decode(localStorage.getItem('jwt_token')).url
              }
              localStorage.setItem('user', JSON.stringify(user));
              router.push('/profile');
            }).fail(function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 409) {
                  Materialize.toast('Email or Username already in use.',4000);
                } else {
                  Materialize.toast('Something went wrong. Please try again.',4000);
                }
            });
          }).fail(function(jqXHR, textStatus, errorThrown) {
            var newUser = {
              username: self.credentials.username,
              email: self.credentials.email,
              password: self.credentials.password,
            };
            $.post("https://cryptic-savannah-75374.herokuapp.com/api/register", newUser, function(result){
              localStorage.setItem('jwt_token', result.jwt_token);
              localStorage.setItem('refresh_token', result.refresh_token);
              var user = {
                username: jwt_decode(localStorage.getItem('jwt_token')).username,
                email: jwt_decode(localStorage.getItem('jwt_token')).email,
                isVerified: jwt_decode(localStorage.getItem('jwt_token')).isVerified,
                user_id: jwt_decode(localStorage.getItem('jwt_token')).user_id,
                role: jwt_decode(localStorage.getItem('jwt_token')).role,
                banned: jwt_decode(localStorage.getItem('jwt_token')).banned,
                url: jwt_decode(localStorage.getItem('jwt_token')).url
              }
              localStorage.setItem('user', JSON.stringify(user));
              router.push('/profile');
            }).fail(function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status == 409) {
                  Materialize.toast('Email or Username already in use.',4000);
                } else {
                  Materialize.toast('Something went wrong. Please try again.',4000);
                }
            });
          });

        }
      });
    },
    logIn: function(ev) {
      ev.preventDefault();
      var self = this;
      this.$validator.validateAll(['l_username','l_password']).then((result) => {
        if (result) {
          var user = {
            username: self.logincreds.username,
            password: self.logincreds.password
          };
          $.post("https://cryptic-savannah-75374.herokuapp.com/api/login", user, function(result){
            localStorage.setItem('jwt_token', result.jwt_token);
            localStorage.setItem('refresh_token', result.refresh_token);
            var user = {
              username: jwt_decode(localStorage.getItem('jwt_token')).username,
              email: jwt_decode(localStorage.getItem('jwt_token')).email,
              isVerified: jwt_decode(localStorage.getItem('jwt_token')).isVerified,
              user_id: jwt_decode(localStorage.getItem('jwt_token')).user_id,
              role: jwt_decode(localStorage.getItem('jwt_token')).role,
              banned: jwt_decode(localStorage.getItem('jwt_token')).banned,
              url: jwt_decode(localStorage.getItem('jwt_token')).url
            }
            localStorage.setItem('user', JSON.stringify(user));
            router.push('/profile');
          }).fail(function(jqXHR, textStatus, errorThrown) {
              if(jqXHR.status == 401) {
                //self.$validator.errors.add('wrong_pw', 'Wrong password', 'password1');
                Materialize.toast('Wrong Password',4000);
              } else if(jqXHR.status == 404) {
                Materialize.toast('User with this username does not exist.',4000);
              } else {
                Materialize.toast('Something went wrong. Please try again.',4000);
              }
          });
        }
      });
    },
    auth(network) {
      const hello = this.hello;
      var self = this;
      hello.login(network,{}).then(function() {
        const authRes = hello(network).getAuthResponse();
        console.log(authRes);
        $.post("https://cryptic-savannah-75374.herokuapp.com/api/sociallogin", {access_token: authRes.access_token}, function(result){
          localStorage.setItem('jwt_token', result.jwt_token);
          localStorage.setItem('refresh_token', result.refresh_token);
          localStorage.setItem('user', JSON.stringify(result.user));
          router.push('/profile');
        }).fail(function(jqXHR, textStatus, errorThrown) {
            if(jqXHR.status == 404) {
              console.log(JSON.parse(jqXHR.responseText));
              Materialize.toast(errorThrown,4000);
            }
        });
      })
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


#container {
  text-align: center;
  height: 100vh;
  max-width: 100%;
}

.input-field label {
  color: #90a4ae;
  font-weight: bold;
}

.halfheight {
  padding-bottom: 20px;
}

h2 {
  text-shadow: 3px 2px 2px rgba(93, 98, 98, 1);
  letter-spacing: 3px;
  color: white;
  font-family: Roboto;
  font-weight:bold;
}
h3 {
  text-shadow: 3px 2px 2px rgba(93, 98, 98, 1);
  letter-spacing: 3px;
  color: white;
  font-family: Roboto;
  font-weight:300;
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
#username:focus,#email:focus,#password:focus,#passwordConfirm:focus,#l_username:focus,#l_password:focus {
  border-bottom: 1px solid #546e7a;
  box-shadow: 0 1px 0 0 #546e7a;
}
#fblog {
  background-color: #3b5998;
  font-size: 0.7em;
  padding: 0;
}

</style>
