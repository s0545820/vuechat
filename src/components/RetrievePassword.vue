<template>
  <div id="outerdiv" class="yellow">
    <form @submit="submitForm">
      <div class="row padded">
        <div class="input-field col s12 m6 l6 offset-l3 offset-m3">
          <input placeholder="Email" type="email" id="email" name="email" v-model="email" v-validate="'required|email'">
          <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>
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
import router from '../router/index';
import jwt_decode from 'jwt-decode';
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
      this.$validator.validateAll().then((result) => {
        if (result) {
          $.post("http://localhost:3000/api/forgot/", {email: self.email}, function(result){
            Materialize.toast('Please check your email for further instructions.', 4000);
          }).fail(function(jqXHR, textStatus, errorThrown) {
              if(jqXHR.status == 404) {
                router.push('/retrievePassword');
                Materialize.toast('Account with this email does not exist.',4000);
              } else {
                router.push('/retrievePasword');
                Materialize.toast('Something went wrong. Please try again.',4000);
              }
          });
        }
      });
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
#outerdiv {
  height: 100vh;
}
.row.padded {
  padding-top: 100px;
}
.btn {
  width: 100%;
  background-color: #90a4ae;
}

.btn:hover {
  background-color: #546e7a;
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
