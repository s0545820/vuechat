<template>
  <div>
    <p v-if="isConnected">We're connected to the server!</p>
    <p>Message from server: "{{socketMessage}}"</p>
    <button @click="pingServer()">Ping Server</button>
  </div>
</template>

<script>
/*import Vue from 'vue';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
export const SocketInstance = socketio('http://localhost:3000/');
Vue.use(VueSocketIO, SocketInstance);*/

export default {
  name: 'test',
  data() {
    return {
      isConnected: false,
      socketMessage: ''
    }
  },

  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
      //this.socketMessage = this.$socket.id;
    },
    disconnect() {
      this.isConnected = false;
    },
    pingBack(val) {
      this.socketMessage = val;
    }
  },

  methods: {
    pingServer() {
      var self = this;
      // Send the "pingServer" event to the server.
      this.$socket.emit('pingServer', self.$socket.id);
    }
  }
}
</script>
