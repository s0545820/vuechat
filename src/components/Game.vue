<template>
    <div class="container game-container">
      <div class="row">
        <div id="endcredits">
          <!--<h3><p>Congratulations!</p> You won.</h3>-->
          <span v-html="text"></span>
          <div class="row">
            <button @click="resetGame()" id="endcredits-button" class="btn col s8 m8 l2 offset-s2 offset-m2 offset-l5">Close</button>
          </div>
        </div>
        <div id="game" class="col s12 m10 l6 offset-l3 offset-m1">
          <div class="row">
            <h5>Your Color: <span style="color: blue">{{show_color}}</span> | Turn: <span v-if="turn">You</span><span v-else>{{opponent.name}}</span></h5>
            <h4 v-show="2!=2">{{myturn}}</h4>
            <h4 v-show="2!=2">{{turn}}</h4>
          </div>
          <div id="row1" class="row">
            <div id="r1c1" class="gamecell col s4" @click="maketurn($event)">
            </div>
            <div id="r1c2" class="gamecell col s4" @click="maketurn($event)">
            </div>
            <div id="r1c3" class="gamecell col s4" @click="maketurn($event)">
            </div>
          </div>
          <div class="row">
            <div id="r2c1" class="gamecell col s4" @click="maketurn($event)">
            </div>
            <div id="r2c2" class="gamecell col s4" @click="maketurn($event)">
            </div>
            <div id="r2c3" class="gamecell col s4" @click="maketurn($event)">
            </div>
          </div>
          <div class="row">
            <div id="r3c1" class="gamecell col s4" @click="maketurn($event)">
            </div>
            <div id="r3c2" class="gamecell col s4" @click="maketurn($event)">
            </div>
            <div id="r3c3" class="gamecell col s4" @click="maketurn($event)">
            </div>
          </div>
          <div class="row" style="text-align: center;">
            <span id="">
              <i class="toggle-game material-icons" @click="toggleGame()" title="hide">{{expand}}</i>
            </span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

import jwt_decode from 'jwt-decode';
import router from '../router/index';

export default {
  name: 'game',
  props: [
    'opponent'
  ],
  data () {
    return {
      turn: false,
      color: 'rgb(0, 0, 255)',
      show_color: 'Blue',
      pattern: 'bblue',
      expand: 'expand_less',
      text_lost: '<h3><p>Shit happens.</p> Try your best next time.</h3>',
      text_won: '<h3><p>Congratulations!</p> You won.</h3>',
      text: ''
    }
  },
  sockets: {
    madeturn: function(cell) {
      $('#'+cell).css('background-color', this.opponent.color);
      //$('#'+data.cell).addClass(this.opponent.pattern);
      $('#'+cell).addClass('checked');
      this.turn = true;
    },
    gamewon: function() {
      Materialize.toast('You lost!',2000);
      this.text = this.text_lost;
      $('#endcredits').fadeIn(500);
    }
  },
  methods: {
    maketurn: function(event) {
      let cellid = event.target.id;
      if(this.turn) {
        if ($('#'+cellid).hasClass('checked')) {
          Materialize.toast('This field is already set', 2000);
        } else {
          $('#'+cellid).css('background-color', this.color);
          //$('#'+cellid).addClass(this.pattern);
          $('#'+cellid).addClass('checked');
          let data = {
            socketid: this.opponent.socketid,
            cell: cellid
          }
          this.$socket.emit('maketurn', data);
          this.turn = false;

          if(this.gamewon()) {
            Materialize.toast('You won!',2000);
            this.$socket.emit('gamewon', this.opponent.socketid);
            this.text = this.text_won;
            $('#endcredits').fadeIn(500);
          }
        }
      } else {
        Materialize.toast('Not your turn.',2000);
      }

    },
    gamewon: function() {
      //Logic for winning the game
      if(
        ($('#r1c1').css('background-color') === $('#r1c2').css('background-color') && $('#r1c1').css('background-color') === $('#r1c3').css('background-color') && $('#r1c1').css('background-color') === this.color) ||
        ($('#r2c1').css('background-color') === $('#r2c2').css('background-color') && $('#r2c1').css('background-color') === $('#r2c3').css('background-color') && $('#r2c1').css('background-color') === this.color) ||
        ($('#r3c1').css('background-color') === $('#r3c2').css('background-color') && $('#r3c1').css('background-color') === $('#r3c3').css('background-color') && $('#r3c1').css('background-color') === this.color) ||
        ($('#r1c1').css('background-color') === $('#r2c1').css('background-color') && $('#r1c1').css('background-color') === $('#r3c1').css('background-color') && $('#r1c1').css('background-color') === this.color) ||
        ($('#r1c2').css('background-color') === $('#r2c2').css('background-color') && $('#r1c2').css('background-color') === $('#r3c2').css('background-color') && $('#r1c2').css('background-color') === this.color) ||
        ($('#r1c3').css('background-color') === $('#r2c3').css('background-color') && $('#r1c3').css('background-color') === $('#r3c3').css('background-color') && $('#r1c3').css('background-color') === this.color) ||
        ($('#r1c1').css('background-color') === $('#r2c2').css('background-color') && $('#r1c1').css('background-color') === $('#r3c3').css('background-color') && $('#r1c1').css('background-color') === this.color) ||
        ($('#r1c3').css('background-color') === $('#r2c2').css('background-color') && $('#r1c3').css('background-color') === $('#r3c1').css('background-color') && $('#r1c3').css('background-color') === this.color)
      ) {
        return true;
      } else {
        return false;
      }
    },
    resetGame: function() {
      $('.gamecell').css('background-color', 'white');
      $('.gamecell').removeClass('checked');
      $('#endcredits').css('display', 'none');
      $('.container.game-container').fadeOut(500);
    },
    toggleGame: function() {
      if(this.expand == 'expand_less') {
        $('.container').css('top','-325px');
        this.expand = 'expand_more';
      } else {
        $('.container').css('top','0px');
        this.expand = 'expand_less';
      }
    }
  },
  created: function () {
  },
  computed: {
    myturn: function() {
      this.turn = !this.opponent.turn;
      return !this.opponent.turn;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.game-container {
  display: none;
  height: 370px;
  border: 1px solid black;
  position: absolute;
  left: 15%;
  top:0;
  background-color: lightgrey;
  transition: top 2s ease 0s;
}
.gamecell {
  height: 90px;
  border: 1px solid black;
  background-color: white;
}
.row {
  margin: 0;
}
.checked {

}
.bblue {
  background-color: blue;
}
.rred {
  background-color: red;
}

@media only screen and (max-width: 600px) {
  .container {
    left: 0;

  }
  .toggle-game.material-icons {
    margin-top: 8px;
  }
}
@media only screen and (max-width: 992px) and (min-width: 601px)  {

}
.toggle-game {
  border: 1px solid black;
  border-radius: 1000px;
  font-size: 2.8rem;
  margin-top: 5px;
  cursor: pointer;
}
#endcredits {
  display: none;
  position: absolute;
  background-color: rgba(0,0,0,0.8);
  height: 100%;
  width: 100%;
  color: white;
  text-align: center;
}
#endcredits-button {
  margin-top:60px;
  padding-top: 10px;
  padding-bottom: 40px;
  background-color: #ff8a65;
}
</style>
