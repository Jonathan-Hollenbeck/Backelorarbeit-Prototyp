import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, style, transition } from '@angular/animations'

/**
In diesem Component Teil wird alles geladen, was wir brauchen.
Ausserdem werden hier die Animationen erstellt.
*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    /**
    In trigger wird der Name der Animation festgelegt
    um sie im HTML Code aufzurufen.
    */
    trigger('movePlayer', [
      /**
      In state wird festgelegt bei welchen Werten der Triggervariable
      die Animation abgespielt werden soll. Im HTML Code wird eine boolsche
      Variable als value benutzt und wir wollen die Anmiation bei jedem umkehren
      der Variable triggern.
      */
      state("true,false", style({
        //Hier werden die in der HTML Datei uebergebenen Werte eingesetzt.
        left: '{{x}}px',
        top: '{{y}}px',
      }), {params: {x: 200, y: 100}}),
      /**
      Hier wird die Geschwindigkeit der Animation festgelegt,
      wir wollen immer eine Geschwindigkeit von 700 Millisekunden.
      */
      transition('*=>*', animate('700ms'))
    ]),
    /**
    Die zweite Animation für den Ball funktioniert genauso,
    nur hier wird der momentane Ballhalter als Triggervariable uebergebenen.
    */
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

  //Die Spieler werden in Arrays aufgeteilt.
  angriffspieler: Player[] = [];
  abwehrspieler: Player[] = [];

  //ballwhere dient dazu zu wissen bei welchem Angriffspieler der Ball ist.
  ballwhere: number;
  //ballx und bally dienen um zu Wissen, wo sich der Ball auf dem Spielfeld befindet.
  ballx: number;
  bally: number;

  //doLoop haelt die Schleife am Leben.
  doLoop: boolean = false;

  //balldirectionright guckt in welche Richtung der Ball gerade gespielt wird.
  balldirectionright: boolean = false;

  //dient zur Identifikation des Spielers, dessen Optionen gerade bearbeitet werden.
  selectedSpieler: Player;

  //Construktor indem die Spieler, Regeln und der Ball initialisiert werden.
  ngOnInit() {
    console.log("app.component.ts");
    this.initPlayers();
    this.initRules();
    this.ballx = this.angriffspieler[2].x;
    this.bally = this.angriffspieler[2].y;
    this.ballwhere = 2;
  }

  //Hilfsmethode um die Spieler zu Initialisieren. Kann wahrscheinlich auch in eine JSON
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

  //Initialisiere Regeln fuer Spieler aus einer JSON Datei
  initRules() {
    //Json einlesen
    let rules = require('../assets/rules/6_0_abwehr.json');
    //durch alle Spieler laufen und Regeln einspeichern
    rules.spieler.forEach(spieler => {
      spieler.entscheidungsbaum.forEach(rule =>{
        this.abwehrspieler[spieler.spieler_id].addRule(rule.ballwhere, rule.moveto);
      })
    });
  }

  //Den aktuell bearbeitbaren Spieler wechseln
  changeSelectedPlayerHandler(abwehrspielerIndex: number) {
    this.selectedSpieler = this.abwehrspieler[abwehrspielerIndex];
  }

  //bewege einen Spieler
  movePlayer(player: Player, x:number, y:number){
    //neue x und y Werte
    player.x = x;
    player.y = y;
    //trigger die Animation
    player.move = !player.move;
  }

  /**
  Bewege den Ball einen weiter je nachdem
  in welche Richtung er gerade gespielt wird
  und welcher Spieler ihn gerade hat.
  */
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

  /**
  aendere die Position des Balls zu dem Spieler zu dem er gespielt wurde
  und passe die ballwhere an.
  */
  spielBallZu(playerIndex: number){
    this.ballx = this.angriffspieler[playerIndex].x;
    this.bally = this.angriffspieler[playerIndex].y;
    this.ballwhere = playerIndex;
  }

  //starte die Schleife und aeussere Schleife
  startstopLoop() {
    this.doLoop = !this.doLoop;
    if(this.doLoop == true){
      this.loop();
    }
  }

  //innere Schleife
  loop(){
    /**bewege Ball, Spieler und
    gib dem Spieler 50 Millisekunden mehr Zeit als die Animation braucht.
    */
    setTimeout(() => {
      this.moveBall();
      this.checkForPlayermovement();
      if (this.doLoop == true) this.loop();
    }, 750);
  }

  //checkt ob ein Abwehrspieler sich bewegen muss und bewegt ihn dementsprechend.
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

//Klasse fuer Spieler
class Player {
  //startX und startY fuer das zurueckziehen an die Anfangsposition
  startX: number;
  startY: number;
  //veraenderbare aktuelle Position
  x: number;
  y: number;

  //Name des Spielers
  name: string;

  //Boolen Variable die bei jedem umaendern die Animation triggert.
  move: boolean = false;

  //Der Entscheidungsbaum fuer diesen Spieler.
  entscheidungsbaum: Rule[] = [];

  //Konstruktor indem die Startposition und Name festgelegt wird
  constructor(x:number, y:number, name: string){
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;

    this.name = name;
  }

  //Methode zum hinzufuegen einer Regel.
  addRule(ballPlayerIndex: number, movePlayerIndex: number){
    this.entscheidungsbaum.push(new Rule(ballPlayerIndex, movePlayerIndex));
  }

  //Methode zum aendern des Spielers der den Ball hat in einer Regel.
  changeBallPlayerInRule(ruleAndBallPlayerIndex: any){
    this.entscheidungsbaum[ruleAndBallPlayerIndex[0]].ballPlayerIndex = ruleAndBallPlayerIndex[2];
  }

  //Methode zum aendern des Spielers zu dem sich hinbewegt werden soll in einer Regel.
  changeMovePlayerInRule(ruleAndMovePlayerIndex: any){
    if(ruleAndMovePlayerIndex[2] != "-"){
      this.entscheidungsbaum[ruleAndMovePlayerIndex[0]].movePlayerIndex = ruleAndMovePlayerIndex[2];
      this.entscheidungsbaum[ruleAndMovePlayerIndex[0]].backToStart = false;
    } else {
      this.entscheidungsbaum[ruleAndMovePlayerIndex[0]].backToStart = true;
    }
  }
}

//Klasse fuer Regeln
class Rule {
  //Spieler der den Ball hat zum triggern.
  ballPlayerIndex: number;
  //Spieler zu dem sich hinbewegt werden soll.
  movePlayerIndex: number;

  //Wenn true bewegt sich der Spieler zu seiner Startposition zurueck.
  backToStart: boolean = false;

  //Konstruktor zum setzten der oben genannten Variablen
  constructor(ballPlayerIndex: number, movePlayerIndex: number){
    this.ballPlayerIndex = ballPlayerIndex;
    this.movePlayerIndex = movePlayerIndex;
    if(movePlayerIndex == -1){
      this.backToStart = true;
    }
  }
}
