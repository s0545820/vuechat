<template>
    <div>
      <div id="chat" class="row">
        <div id="chat-messages" class="col s12 m12 l12 yellow">
          <ul id="messages">
            <li v-for="message in messages">
              {{message}}
            </li>
            <button v-on:click="disconnect">disconnect</button>
          </ul>
        </div>
        <span id="menuCollaps" v-on:click="showElement">&#9776;</span>
        <div id="users" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" v-on:click="closeElement">&times;</a>
            <ul>
              <li class="row useritem" v-for="user in users">
                  <span class="btn small col s10 m10 l6 offset-l1 offset-s1 offset-m1">{{user.username}}</span>
              </li>
            </ul>
        </div>
      </div>
      <div id="input-chat" class="row valign-wrapper">
        <input id="inp" type="text" name="chat" class="col s8 m8 l10" v-model="message">
        <button @click="sendMessage" class="btn-large col s4 m4 l2">Send</button>
      </div>
    </div>
</template>
<script>

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import router from '../router/index';
import Vue from 'vue';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
//const SocketInstance = socketio('http://localhost:3000/');
//Vue.use(VueSocketIO, SocketInstance);

export default {
  name: 'chat',
  data () {
    return {
      username: '',
      users: [],
      messages: ['Frank: hey','Yoshi: Whats up?!'],
      message: ''
    }
  },
  sockets: {
    added: function(usrname) {
      this.users.push({id: 45, username: usrname}); // GET USER BY ID (API) AND SAVE IN ARRAY
      Materialize.toast(usrname + ' joined the chat!', 2000);
    },
    disconnected: function(socketid) {
      for(let user of this.users) {
        if(user.socketid === socketid) {
          this.users.splice(i, 1);
          break;
        }
      }
      Materialize.toast('User disconnected', 2000);
    },
    recieveMessage: function(msg) {
      this.messages.push(msg);
    }
  },
  methods: {
    disconnect: function() {

      router.push('/profile');
      Materialize.toast('You left the chat', 2000);
      this.$socket.emit('disc');
    },
    sendMessage: function() {
      var msg = this.username + ': ' + this.message;
      this.$socket.emit('chat message', msg);
      this.message = '';
    },
    sendPrivateMessage: function() {
      var user = this.users.filter(function( puser ) {
        return puser.username == 'user1';
      });
      var daten = {
        msg: this.username + ': ' + this.message,
        socketid: user[0].socketid
      }
      this.$socket.emit('private-message', daten);
      this.message = '';
    },
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
    setStatusAndSocket: function(status, id) {
      var daten = {
        status: status,
        socketid: id
      }
      $.ajax({
        url: "http://localhost:3000/api/users/status",
        type: 'PUT',
        headers: {"x-access-token": localStorage.getItem('jwt_token')},
        data: daten,
        success: function(data) {
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          //Materialize.toast('Could not change status. Please try again.',4000);
        }
      });
    }
  },
  created: function () {
    const SocketInstance = socketio('http://localhost:3000/');
    this.use(VueSocketIO, SocketInstance);
    var self = this;
    var decoded = jwt_decode(localStorage.getItem('jwt_token'));
    if(decoded.exp*1000 > Date.now()) {
      var user = JSON.parse(localStorage['user']);
      if(user.isVerified) {
        this.username = user.username;
        var id = self.$socket.id;
        this.setStatusAndSocket(1, id);
        this.loadUsers();
        this.$socket.emit('joined', user.user_id);
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
  height:30%;
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
    background-color: yellow;
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
.btn.small {
  height: 24px;
  line-height: 24px;
  padding: 0 0.5rem;
}
.useritem {
  margin-bottom: 10px;
}


</style>
