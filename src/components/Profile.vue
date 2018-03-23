<template>
    <div v-if="this.auth" class="container">
      <button id="logout" class="btn red" v-on:click="logOut">Logout</button>
      <!--Admin view-->
      <div v-if="role == 'admin'" id="admin" class="row">
        <div id="bannedUsers" class="col s12 l5">
          <div>
            <h5 style="text-decoration: underline;">Banned Users</h5>
            <p v-show="banned_users === undefined || banned_users.length == 0">Ban 'em all!</p>
            <ul id="banlist">
                <li class="row" v-for="user in banned_users">
                  <span id="bannedname" class="col s6 m6 l6">{{user.username}}</span>
                  <span class="col s6 m6 l6">
                    <i @click="unbanUser(user._id)" class="col s8 m8 l4 material-icons green lighten-1 btn small" title="unban user">mood</i>
                  </span>
                </li>
            </ul>
          </div>
        </div>
        <div class="col s12 l7">
            <h3>{{ name }}</h3>
            <div>
              <router-link id="enteradmin" :to="'chat'" class="waves-effect btn-large">enter chat</router-link>
            </div>
        </div>
      </div>
      <!--Admin view end-->
      <div v-else id="auth" class="row">
        <img  v-show="social" id="profile_pic" v-bind:src="pictureURL" width="200" height="200">
        <h3>{{ name }}</h3>
        <div>
          <span v-on:click="sendVerification" v-if="!isVerified" class="btn small light-blue darken-4">verify</span>
        </div>
        <div>
          <router-link :to="'chat'" class="waves-effect btn-large" :disabled="!isVerified || banned">enter chat</router-link>
          <p v-show="!isVerified" class="text-danger">Verify your account to enter the chat</p>
          <p v-show="banned" class="text-danger">Your account is banned.</p>
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
      loading: false,
      pictureURL: '',
      social: false,
      role: '',
      banned: false,
      banned_users: []
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
        url: "https://cryptic-savannah-75374.herokuapp.com/api/verify",
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
    },
    unbanUser: function(userid) {
      var self = this;
      $.ajax({
        url: "https://cryptic-savannah-75374.herokuapp.com/api/users/unban",
        type: 'POST',
        headers: {"x-access-token": localStorage.getItem('jwt_token')},
        data: { userid: userid },
        success: function(data) {
          for(let i = 0; i < self.banned_users.length; i++) {
            if(self.banned_users[i]._id === userid) {
              self.banned_users.splice(i,1);
              break;
            }
          };
          Materialize.toast('User has been unbanned.',2000);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          Materialize.toast('Something went wrong. Please try again.',4000);
        }
      });
    }
  },
  created: function () {
    var self = this;
    var decoded = jwt_decode(localStorage.getItem('jwt_token'));
    if(decoded.exp*1000 > Date.now()) {
      this.auth = true;
      var user = JSON.parse(localStorage['user']);
      if (user.role == 'admin') {
        $.ajax({
          url: "https://cryptic-savannah-75374.herokuapp.com/api/users/",
          type: 'GET',
          headers: {"x-access-token": localStorage.getItem('jwt_token')},
          success: function(data) {
            for(var i=0;i<data.users.length;i++) {
              if(data.users[i].banned) {
                self.banned_users.push(data.users[i]);
              }
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            Materialize.toast('Could not load banned users. Please refresh the page.',4000);
          }
        });
      }
      this.name = user.username;
      this.mail = user.email;
      this.banned = user.banned;
      this.role = user.role;
      this.isVerified = user.isVerified;
      this.social = user.social;
      if(this.social) {
        this.pictureURL = user.picture.data.url;
      }
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

.noauthtext {
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
#profile_pic {
  border-radius: 1000px;
}

#auth {
  padding-top: 100px;
  text-align: center;
}
#admin {
    padding-top: 200px;
}
#enteradmin {
  margin-top:20px;
}
#bannedname {
  font-size: 1.4rem;
  color: #d32f2f;
  word-wrap: break-word;
}
#bannedUsers {
  max-height: 50vh;
  overflow-y: auto;
}
@media screen and (max-width: 991px) {
  #admin {
    text-align: center;
    padding-top: 100px;
  }
}
</style>
