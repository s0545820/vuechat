<template>
    <div v-if="this.auth" class="container yellow">
      <button id="logout" class="btn red" v-on:click="logOut">Logout</button>
      <div class="authtext">
        <h3>{{ name }}</h3>
        <h3>{{ mail }} </h3>
        <div>
          <span v-on:click="sendVerification" v-if="!isVerified" class="btn small light-blue darken-4">verify</span>
        </div>
        <div>
          <router-link :to="'chat'" class="waves-effect btn-large" :disabled="!isVerified">enter chat</router-link><!--Implement router link to chat component-->
          <p v-show="!isVerified" class="text-danger">Verify your account to enter the chat</p>
        </div>
      </div>
      <div v-show="loading" id="overlay">
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
      </div>
    </div>
    <div  v-else-if="!this.auth" class="container red">
      <div class="noauthtext">
        <h2>Please</h2>
        <router-link class="btn-large" to="/">login</router-link>
        <h2>to view this page</h2>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import router from '../router/index';
export default {
  name: 'profile',
  data () {
    return {
      name: '',
      mail: '',
      error: '',
      isVerified: false,
      auth: false,
      loading: false
    }
  },
  methods: {
    logOut: function() {
      localStorage.clear();
      Materialize.toast('You have been successfully logged out.', 4000);
      router.push('/');
    },
    sendVerification: function() {
      var self = this;
      this.loading = true;
      $.ajax({
        url: "http://localhost:3000/api/verify",
        type: 'POST',
        headers: {"x-access-token": localStorage.getItem('jwt_token')},
        success: function(data) {
          self.loading = false;
          Materialize.toast('A verification email has been sent to you',4000);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          self.loading = false;
          Materialize.toast('Something went wrong. Please try again.',4000);
        }
      });
    }
  },
  created: function () {
    var decoded = jwt_decode(localStorage.getItem('jwt_token'));
    if(decoded.exp*1000 > Date.now()) {
      this.auth = true;
      var user = JSON.parse(localStorage['user']);
      this.name = user.username;
      this.mail = user.email;
      this.isVerified = user.isVerified;
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


#logout {
  position: fixed;
  top: 10px;
  right: 20px;
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
:disabled {
  background: rgba(255,238,88,0.9);
}
.container {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  height: 100vh;
}
.noauthtext {
  text-align: center;
  margin-top: 200px;
}
.authtext {
  text-align: center;
  margin-top: 200px;
}
.btn.small {
  height: 24px;
  line-height: 24px;
  padding: 0 0.5rem;
}
span {
  margin-bottom: 10px;
}
#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  background-color: rgba(0,0,0,0.8);
}
#overlay .progress {
  position: relative;
  margin:auto;
  top:50%;
  width:30%;
  background-color: #90a4ae;
}
.indeterminate {
  background-color: #546e7a;
}
</style>
