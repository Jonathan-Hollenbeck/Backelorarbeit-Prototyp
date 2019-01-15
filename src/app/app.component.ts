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

  //balldirection guckt in welche Richtung der Ball gerade gespielt wird. 0 fuer rechts und 1 fuer links
  balldirection: number = 0;

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
    //Angriffspieler JSON einlesen
    let angriff = require('../assets/json/angriffspieler.json');
    //durch alle Spieler laufen und in angriffspieler pushen
    angriff.spieler.forEach(spieler => {
      this.angriffspieler.push(new Player(spieler.spieler_x, spieler.spieler_y, spieler.spieler_name));
    });
    //Abwehrspieler JSON einlesen
    let abwehr = require('../assets/json/abwehrspieler.json');
    //durch alle Spieler laufen und in abwehrspieler pushen
    abwehr.spieler.forEach(spieler => {
      this.abwehrspieler.push(new Player(spieler.spieler_x, spieler.spieler_y, spieler.spieler_name));
    });
    //selected Spieler auf den ersten Abwehrspieler setzen
    this.changeSelectedPlayerHandler(0);
  }

  //Initialisiere Regeln fuer Spieler aus einer JSON Datei
  initRules() {
    //JSON einlesen
    let rules = require('../assets/json/6_0_abwehr.json');
    console.log("initRules no Code");
    //durch alle Spieler laufen und Regeln einspeichern
    /**rules.spieler.forEach(spieler => {
      spieler.entscheidungsbaum.forEach(rule =>{
        this.abwehrspieler[spieler.spieler_id].addRule(rule.ballwhere, rule.moveto);
      })
    });*/
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
      this.balldirectionright = 0;
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
      this.balldirectionright = 1;
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

  /**
  Die Aktionstabelle fuer diesen Spieler.
  Aktionen bestehen aus den beiden Bedingungen ballwhere und balldirection
  und der eigentlichen Aktion mit moveto.
  Dabei sind ballwhere und moveto die id fuer den Angriffspieler zu dem sich hinbewegt werden soll.
  Die Aktion in der 0 Zeile ist immer die Default Aktion mit ballwhere = -1 und balldirection = -1.
  */
  Aktionstabelle: Rule[] = [];

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
    //this.entscheidungsbaum.push(new Rule(ballPlayerIndex, movePlayerIndex));
  }

  //Methode zum aendern des Spielers der den Ball hat in einer Regel.
  changeBallPlayerInRule(ruleAndBallPlayerIndex: any){
    //this.entscheidungsbaum[ruleAndBallPlayerIndex[0]].ballPlayerIndex = ruleAndBallPlayerIndex[2];
  }

  //Methode zum aendern des Spielers zu dem sich hinbewegt werden soll in einer Regel.
  changeMovePlayerInRule(ruleAndMovePlayerIndex: any){
    /**if(ruleAndMovePlayerIndex[2] != "-"){
      this.entscheidungsbaum[ruleAndMovePlayerIndex[0]].movePlayerIndex = ruleAndMovePlayerIndex[2];
      this.entscheidungsbaum[ruleAndMovePlayerIndex[0]].backToStart = false;
    } else {
      this.entscheidungsbaum[ruleAndMovePlayerIndex[0]].backToStart = true;
    }*/
  }
}
