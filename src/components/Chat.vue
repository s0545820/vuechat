<template>
  <div class="grey lighten-2">
    <div class="container">
      <div id="chat" class="row">
        <div id="chat-messages" class="col s12 m12 l12">
          <div id="disconnect" class="row">
            <button id="discn" class="deep-orange lighten-1 btn col s8 m6 l2 offset-s2 offset-m3 offset-l5"v-on:click="disconnect">disconnect</button>
          </div>
          <div id="msgs">
            <ul id="messages-list">
              <li v-for="message in messages">
                <span>{{message.from}}: {{message.msg}}</span>
              </li>
            </ul>
          </div>
          <div id="toWh" class="row hide-on-med-and-up">
            <div v-if="!privatem" class="col s12 msgTo">
              <span class="toWhom">To: All</span>
            </div>
            <div v-else class="col s12 msgTo"><span class="toWhom">To: {{selected.username}}</span>
                <i @click="privatem = false" id="clear" class="tiny material-icons">close</i>
            </div>
          </div>
        </div>
        <span id="menuCollaps" v-on:click="showElement">&#9776;</span>
        <div id="users" class="sidenav grey lighten-1">
            <a href="javascript:void(0)" id="closebtn" v-on:click="closeElement">&times;</a>
            <ul>
              <li class="row useritem" v-for="user in users">
                  <span @click="selectPrivate(user)" class="deep-orange lighten-1 btn small col s10 m10 l8 offset-l2 offset-s1 offset-m1">{{user.username}}</span>
              </li>
            </ul>
        </div>
      </div>
      <form v-on:submit="sendMessage">
        <div id="input-chat" class="row valign-wrapper">
          <div v-if="!privatem" class="hide-on-small-only col m2 l2 msgTo">
            <span>To: All</span>
          </div>
          <div v-else class="hide-on-small-only col m2 l2 msgTo">To: {{selected.username}}
              <i @click="privatem = false" id="clear" class="tiny material-icons">close</i>
          </div>
          <input id="inp" type="text" name="chat" class="col s8 m8 l8" v-model="message">
          <div class="class col s4 m2 l2">
            <button id="submit" :disabled="!message" type="submit" name="submit" class="deep-orange lighten-1 btn-large col s12 m10 l10 offset-l1 offset-m1">
              <i class="material-icons right col s12 m12 l12">send</i>
            </button>
          </div>
        </div>
      </form>
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
      users: [],
      messages: [],
      message: '',
      selected: {
        socketid: '',
        username: ''
      },
      privatem: false
    }
  },
  sockets: {
    added: function(usr) {
      this.users.push(usr);
      Materialize.toast(usr.username + ' joined the chat!', 2000);
    },
    disconnected: function(id) {
      for(let i = 0; i < this.users.length; i++) {
        if(this.users[i].socketid === id) {
          Materialize.toast(this.users[i].username + ' disconnected', 2000);
          this.users.splice(i,1);
          break;
        }
      };
    },
    recieveMessage: function(msg) {
      if(msg.to) {
        this.messages.push({from: msg.from + ' > ' + msg.to, msg: msg.msg});
      } else {
        this.messages.push({from: msg.from, msg: msg.msg});
      }
      $('#msgs').animate({scrollTop: $('#msgs').height() + $('#msgs').height()});
    },
    loadUsers: function(connected_users) {
      this.users = connected_users;
    }
  },
  methods: {
    selectPrivate: function(user) {
      this.selected.socketid = user.socketid;
      this.selected.username = user.username;
      this.privatem = true;
      this.closeElement();
    },
    disconnect: function() {
      this.$socket.disconnect();
      location.reload();
      router.push('/profile');
    },
    sendMessage: function(e) {
      e.preventDefault();
      if(this.privatem == true) {
        this.sendPrivateMessage();
      } else {
        var msg = {
          from: this.username,
          msg: this.message
        }
        //var msg = this.username + ': ' + this.message;
        this.$socket.emit('chat message', msg);
        this.message = '';
      }
    },
    sendPrivateMessage: function() {
      var daten = {
        msg: {
          from: this.username,
          to: this.selected.username,
          msg: this.message
        },
        //msg: this.username + ' > ' + this.selected.username + ': ' + this.message,
        socketid: this.selected.socketid
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
    var self = this;
    var token = localStorage.getItem('jwt_token');
    if(token) {
      var decoded = jwt_decode(token);
      if(decoded.exp*1000 > Date.now()) {
        var user = JSON.parse(localStorage['user']);
        if(user.isVerified) {
          this.username = user.username;
          var joined_user = {
            username: user.username,
            user_id: user.user_id
          };
          this.$socket.emit('joined', joined_user);
          Materialize.toast('Welcome ' + user.username, 2000);
        } else {
          Materialize.toast('Please verify your account first',2000);
          router.push('/profile');
        }
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fixed-bottom {

}
.container {
  height: 100vh;
}
#chat {
  height:90vh;
}
#chat-messages {
  height: 80vh
}
#input-chat {
  height:10vh;
}
#disconnect {
  padding-bottom:30px;
}
#msgs {
  height: 100%;
  overflow-y: auto;
}
#discn {
  height: 30px;
  line-height: 30px;
}
#closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}
#toWh {
  position:fixed;
  bottom:7vh;
  left:10px;
  color: #404040;
  font-size: 15px;
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
  font-size:40px;
  cursor:pointer;
  color: #404040;
}
.sidenav {
    height: 90%;
    width: 300px;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 60px;
    display: none;
}
@media screen and (max-width: 991px) {
  .sidenav {
    width: 100%;
  }
  #menuCollaps {
    font-size:40px;
  }
}
@media screen and (max-width: 600px) {
  #menuCollaps {
    font-size:50px;
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
#messages-list li:nth-child(even) {
  background:#bdbdbd;
}
#messages-list li {
  padding-left: 10px;
  color: #404040;
  font-size: 20px;
  padding-top:3px;
  padding-bottom: 3px;
}
#clear {
  cursor: pointer;
  font-size: 25px;
  position: relative;
  top:8px;
}
#clear:hover {
  color:#f44336;
}
#closebtn {
  color: #404040;
  font-size: 50px;
}
#inp:focus {
  border-bottom: 1px solid #546e7a;
  box-shadow: 0 1px 0 0 #546e7a;
}
#submit:disabled {
  background-color: red;
}



</style>
