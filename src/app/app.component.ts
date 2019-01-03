import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, style, transition } from '@angular/animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('movePlayer', [
      state("true,false", style({
        left: '{{x}}px',
        top: '{{y}}px',
      }), {params: {x: 200, y: 100}}),
      transition('*=>*', animate('700ms'))
    ]),
    trigger('moveBall', [
      state("0,1,2,3,4,5", style({
        left: '{{ballx}}px',
        top: '{{bally}}px',
      }), {params: {ballx: 50, bally: 50}}),
      transition('*=>*', animate('700ms'))
    ])
  ]
})

export class AppComponent implements OnInit {

  angriffspieler: Player[] = [];
  abwehrspieler: Player[] = [];

  ballwhere: number;
  ballx: number;
  bally: number;

  doLoop: boolean = false;

  balldirectionright: boolean = false;

  selectedSpieler: Player;

  ngOnInit() {
    console.log("app.component.ts");
    this.initPlayers();
    this.initRules();
    this.ballx = this.angriffspieler[2].x;
    this.bally = this.angriffspieler[2].y;
    this.ballwhere = 2;
  }

  initPlayers() {
    //Angriffspieler
    this.angriffspieler.push(new Player(460, 370, "LA"));
    this.angriffspieler.push(new Player(370, 220, "RL"));
    this.angriffspieler.push(new Player(240, 200, "RM"));
    this.angriffspieler.push(new Player(100, 220, "RR"));
    this.angriffspieler.push(new Player(10, 370, "RA"));
    this.angriffspieler.push(new Player(240, 340, "KM"));
    //Abwehrspieler
    this.abwehrspieler.push(new Player(400, 400, "AR"));
    this.abwehrspieler.push(new Player(350, 350, "HR"));
    this.abwehrspieler.push(new Player(200, 340, "HM1"));
    this.abwehrspieler.push(new Player(300, 340, "HM2"));
    this.abwehrspieler.push(new Player(130, 350, "HL"));
    this.abwehrspieler.push(new Player(80, 400, "AL"));
    this.abwehrspieler.push(new Player(240, 470, "TW"));
    this.changeSelectedPlayerHandler(0);
  }

  initRules() {
    let rules = require('../assets/rules/6_0_abwehr.json');
    rules.spieler.forEach(spieler => {
      spieler.entscheidungsbaum.forEach(rule =>{
        this.abwehrspieler[spieler.spieler_id].addRule(rule.ballwhere, rule.moveto);
      })
    });
  }

  changeSelectedPlayerHandler(abwehrspielerIndex: number) {
    this.selectedSpieler = this.abwehrspieler[abwehrspielerIndex];
  }

  movePlayer(player: Player, x:number, y:number){
    player.x = x;
    player.y = y;
    player.move = !player.move;
  }

  moveBall(){
    if(this.ballwhere == 0){
      this.spielBallZu(1);
      this.balldirectionright = true;
    } else if(this.ballwhere == 1){
      if(this.balldirectionright == false) this.spielBallZu(0);
      else this.spielBallZu(2);
    } else if(this.ballwhere == 2){
      if(this.balldirectionright == false) this.spielBallZu(1);
      else this.spielBallZu(3);
    } else if(this.ballwhere == 3){
      if(this.balldirectionright == false) this.spielBallZu(2);
      else this.spielBallZu(4);
    } else if(this.ballwhere == 4){
      this.spielBallZu(3);
      this.balldirectionright = false;
    }
  }

  spielBallZu(playerIndex: number){
    this.ballx = this.angriffspieler[playerIndex].x;
    this.bally = this.angriffspieler[playerIndex].y;
    this.ballwhere = playerIndex;
  }

  startstopLoop() {
    this.doLoop = !this.doLoop;
    if(this.doLoop == true){
      this.loop();
    }
  } 

  loop(){
    setTimeout(() => {
      this.moveBall();
      this.checkForPlayermovement();
      if (this.doLoop == true) this.loop();
    }, 750);
  }

  checkForPlayermovement(){
    for(let player of this.abwehrspieler){
      for(let rule of player.entscheidungsbaum){
        if(rule.ballPlayerIndex == this.ballwhere){
          if(rule.backToStart == true){
            this.movePlayer(player, player.startX, player.startY);
          } else {
            this.movePlayer(player, this.angriffspieler[rule.movePlayerIndex].x, this.angriffspieler[rule.movePlayerIndex].y);
          }
        }
      }
    }
  }
}

class Player {
  startX: number;
  startY: number;
  x: number;
  y: number;

  name: string;

  move: boolean = false;

  entscheidungsbaum: Rule[] = [];

  constructor(x:number, y:number, name: string){
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;

    this.name = name;
  }

  addRule(ballPlayerIndex: number, movePlayerIndex: number){
    this.entscheidungsbaum.push(new Rule(ballPlayerIndex, movePlayerIndex));
  }

  changeBallPlayerInRule(ruleAndBallPlayerIndex: any){
    this.entscheidungsbaum[ruleAndBallPlayerIndex[0]].ballPlayerIndex = ruleAndBallPlayerIndex[2];
  }

  changeMovePlayerInRule(ruleAndMovePlayerIndex: any){
    if(ruleAndMovePlayerIndex[2] != "-"){
      this.entscheidungsbaum[ruleAndMovePlayerIndex[0]].movePlayerIndex = ruleAndMovePlayerIndex[2];
      this.entscheidungsbaum[ruleAndMovePlayerIndex[0]].backToStart = false;
    } else {
      this.entscheidungsbaum[ruleAndMovePlayerIndex[0]].backToStart = true;
    }
  }
}

class Rule {
  ballPlayerIndex: number;
  movePlayerIndex: number;

  backToStart: boolean = false;

  constructor(ballPlayerIndex: number, movePlayerIndex: number){
    this.ballPlayerIndex = ballPlayerIndex;
    this.movePlayerIndex = movePlayerIndex;
    if(movePlayerIndex == -1){
      this.backToStart = true;
    }
  }
}
