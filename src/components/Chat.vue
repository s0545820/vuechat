<template>
    <div class="">
      <div id="chat" class="row">
        <div id="chat-messages" class="col s12 m12 l12">
          hey
        </div>
        <span id="menuCollaps" v-on:click="showElement">&#9776;</span>
        <div id="users" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" v-on:click="closeElement">&times;</a>
            <ul>
              <li v-for="user in users">
                {{user.username}}
              </li>
            </ul>
        </div>
      </div>
      <div id="input-chat" class="row valign-wrapper">
        <input id="inp" type="text" name="chat" class="col s10 m10 l10">
        <button class="btn-large col s2 m2 l2">Send</button>
      </div>
    </div>
</template>

<script>

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import router from '../router/index';
export default {
  name: 'chat',
  data () {
    return {
      username: '',
      users: []
    }
  },
  methods: {
    logOut: function() {
      localStorage.clear();
      Materialize.toast('You have been successfully logged out.', 4000);
      router.push('/');
    },
    showElement: function() {
      $('#users').show();
    },
    closeElement: function() {
      $('#users').hide();
    },
    loadUsers: function() {
      var self = this;
      $.ajax({
        url: "http://localhost:3000/api/users",
        type: 'GET',
        headers: {"x-access-token": localStorage.getItem('jwt_token')},
        success: function(data) {
          self.users = data.users;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          //Materialize.toast('Something went wrong. Please try again.',4000);
        }
      });
    },
    setStatus: function(status) {
      var vstatus = status;
      $.ajax({
        url: "http://localhost:3000/api/users/status",
        type: 'PUT',
        headers: {"x-access-token": localStorage.getItem('jwt_token')},
        data: {status: vstatus},
        success: function(data) {
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          //Materialize.toast('Could not change status. Please try again.',4000);
        }
      });
    }
  },
  created: function () {
    var decoded = jwt_decode(localStorage.getItem('jwt_token'));
    if(decoded.exp*1000 > Date.now()) {
      var user = JSON.parse(localStorage['user']);
      if(user.isVerified) {
        this.username = user.username;
        this.setStatus(1);
        this.loadUsers();
      } else {
        router.push('/profile');
      }
    } else {
      router.push('/');
    }
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
#chat {
  position: absolute;
  height:90%;
  width: 100%;
  margin-bottom: 0px;
}
#input-chat {
  position: fixed;
  bottom:0;
  height: 10%;
  width: 100%;
  background-color: red;
}

#inp {
  margin-bottom:0px;
}
.row {
  margin: 0px;
}
#menuCollaps {
  position:fixed;
  right:10px;
  top: 0px;
  font-size:30px;
  cursor:pointer
}
.sidenav {
    height: 90%;
    width: 300px;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    background-color: #111;
    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 60px;
    display: none;
}
.sidenav .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
}
@media screen and (max-width: 991px) {
  .sidenav {
    width: 100%;
  }
  #menuCollaps {
    font-size:60px;
  }
}

</style>
