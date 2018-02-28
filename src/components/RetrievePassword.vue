<template>
  <div id="outerdiv" class="yellow">
    <form @submit="submitForm">
      <div class="row padded">
        <div class="input-field col s12 m6 l6 offset-l3 offset-m3">
          <input placeholder="Email" type="email" id="email" name="email" v-model="email" required>
        </div>
      </div>
      <div class="row">
        <div class="col s8 m3 l2 offset-l5 offset-m5 offset-s2">
          <button type="submit" class="btn">Send</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import router from '../router/index'
export default {
  name: 'retrieve',
  data () {
    return {
      email: '',
    }
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault();
      var self = this;
      var msg = '';
      var email = this.email;
      $.post("http://localhost:3000/api/forgot/", email, function(result){
        if(!result.user_found) {
          msg = 'No user found with this email';
        } else if(result.email_sent) {
          msg = result.message;
        }
        Materialize.toast(msg, 4000);
      });
      //Materialize.toast(msg, 4000);
      //router.push('/');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#outerdiv {
  height: 100vh;
}
.row.padded {
  padding-top: 100px;
}
.btn {
  width: 100%;
}

.text-danger {
  color: #f44336;
  font-weight: bold;
}
button {
  background-color: #90a4ae;
}
button:hover {
  background-color: #546e7a;
}
input:-webkit-autofill {
    -webkit-animation-name: autofill;
    -webkit-animation-fill-mode: both;
}

.input-field input:focus + label {
  color: #546e7a;
}
.input-field input:focus {
  border-bottom: 1px solid #546e7a;
  box-shadow: 0 1px 0 0 #546e7a;
}
@-webkit-keyframes autofill {
    to {
        color: #546e7a;
        background: transparent;
    }
}
.input-field label {
  color: #90a4ae;
  font-weight: bold;
}

::placeholder {
    color: #90a4ae;
    opacity: 1;
}

:-ms-input-placeholder {
    color: #90a4ae;
}

::-ms-input-placeholder {
    color: #90a4ae;
}

</style>
