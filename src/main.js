// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VeeValidate from 'vee-validate'
import custom_messages from './assets/custom_messages'
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
const HelloJs = require('hellojs/dist/hello.all.min.js');
const VueHello = require('vue-hellojs');

HelloJs.init({
  facebook: 1736281499762296
}, {
  redirect_uri: '/'
});

Vue.use(VueHello, HelloJs);
Vue.use(VueSocketIO, socketio('https://cryptic-savannah-75374.herokuapp.com/'));

Vue.use(VeeValidate, {
    dictionary: {
        en: { messages: custom_messages }
    }
});
Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
