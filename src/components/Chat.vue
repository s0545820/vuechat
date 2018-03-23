<template>
  <div class="grey lighten-2">
    <div class="container">
      <div id="disconnect" class="row">
        <button id="discn" class="deep-orange lighten-1 btn col s8 m6 l2 offset-s2 offset-m3 offset-l5"v-on:click="disconnect">disconnect</button>
      </div>
      <div id="chat" class="row">
        <div id="chat-messages" class="col s12 m12 l12">
          <div id="msgs">
            <ul id="messages-list">
              <li v-for="message in messages">
                <span>{{message.from}}: {{message.msg}}</span>
              </li>
            </ul>
          </div>
        </div>
        <span id="menuCollaps" v-on:click="showElement">&#9776;</span>
        <div id="users" class="sidenav grey lighten-1">
            <a href="javascript:void(0)" id="closebtn" v-on:click="closeElement">&times;</a>
            <ul>
              <li class="row useritem" v-for="user in users">
                  <span @click="selectPrivate(user)" class="deep-orange lighten-1 btn small col s7 m8 l6 offset-l1 offset-s1 offset-m1">{{user.username}}</span>
                  <span class="col l2 m1 s2" v-if="role == 'admin' || role == 'mod'">
                    <i @click="kickUser(user.socketid)" class="material-icons deep-orange lighten-1 btn small col l10 m12 offset-l6 offset-m3 offset-s6" title="kick user">sentiment_very_dissatisfied</i>
                  </span>
                  <span class="col l2 m1 s2" v-if="role == 'admin'">
                    <i @click="banUser(user.socketid, user.user_id)" class="material-icons deep-orange lighten-1 btn small col l10 m12" title="ban user">block</i>
                  </span>
              </li>
            </ul>
        </div>
      </div>
      <div id="toWh" class="hide-on-med-and-up">
        <div v-if="!privatem" style="padding-top:10px;" class="col s12 msgTo">
          <span class="toWhom">To: All</span>
        </div>
        <div v-else class="col s12 msgTo"><span class="toWhom">To: {{selected.username}}</span>
            <i @click="privatem = false" id="clear" class="tiny material-icons">close</i>
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
          <input id="inp" type="text" name="chat" class="col s8 m8 l8" v-model="message" autocomplete="off">
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
      privatem: false,
      role: '',
      social: false
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
      $('#chat-messages').animate({scrollTop: $('#chat-messages').height() + $('#chat-messages').height()});
    },
    loadUsers: function(connected_users) {
      this.users = connected_users;
    },
    kicked: function() {
      this.disconnect();
      Materialize.toast('You have been kicked from the chat.', 2000)
    },
    banned: function() {
      var user = JSON.parse(localStorage['user']);
      user.banned = true;
      localStorage.setItem('user', JSON.stringify(user));
      this.disconnect();
      Materialize.toast('You have been banned.', 2000);
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
    kickUser: function(socketid) {
      this.$socket.emit('kick', socketid);
    },
    banUser: function(socketid, userid) {
      var self = this;
      $.ajax({
        url: "https://cryptic-savannah-75374.herokuapp.com/api/users/ban",
        type: 'POST',
        headers: {"x-access-token": localStorage.getItem('jwt_token')},
        data: { userid: userid },
        success: function(data) {
          this.$socket.emit('ban', socketid);
          Materialize.toast('User has been banned.',2000);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          Materialize.toast('Something went wrong. Please try again.',4000);
        }
      });
      this.$socket.emit('ban', socketid);
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
    }
  },
  created: function () {
    var self = this;
    var token = localStorage.getItem('jwt_token');
    if(token) {
      var decoded = jwt_decode(token);
      if(decoded.exp*1000 > Date.now()) {
        var user = JSON.parse(localStorage['user']);
        if(user.banned) {
          Materialize.toast('Your account is banned.',2000);
          router.push('/profile');
        } else {
          self.role = user.role;
          self.social = user.social;
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

.container {
  height: 100vh;
}
#chat {
  height:80vh;
}
#chat-messages {
  height: 80vh;
  overflow-y: auto;
  word-wrap: break-word;
}
#input-chat {
  height:10vh;
}
#disconnect {
  height: 5vh;
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
  /*position:fixed;
  bottom:7vh;
  left:10px;*/
  height: 5vh;
  color: #404040;
  font-size: 15px;
}
#inp {
  margin-bottom:0px;
  font-size: 1.4em;
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
    width: 30%;
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
@media screen and (min-width: 992px) {
  #chat, #chat-messages {
    height:85vh;
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
i.material-icons {
  font-size: 1.5rem;
}


</style>
