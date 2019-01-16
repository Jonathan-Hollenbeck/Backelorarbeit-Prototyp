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
    trigger('bewegeSpieler', [
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
    trigger('bewegeBall', [
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
  angriffspieler: Spieler[] = [];
  abwehrspieler: Spieler[] = [];

  //ballwo dient dazu zu wissen bei welchem Angriffspieler der Ball ist.
  ballwo: number;
  //ballx und bally dienen um zu Wissen, wo sich der Ball auf dem Spielfeld befindet.
  ballx: number;
  bally: number;

  //doLoop haelt die Schleife am Leben.
  doLoop: boolean = false;

  //spielrichtung guckt in welche Richtung der Ball gerade gespielt wird. 0 fuer rechts und 1 fuer links
  spielrichtung: number = 0;

  //dient zur Identifikation des Spielers, dessen Optionen gerade bearbeitet werden.
  selectedSpieler: Spieler;

  //Construktor indem die Spieler, Regeln und der Ball initialisiert werden.
  ngOnInit() {
    console.log("app.component.ts");
    this.initSpielers();
    this.initAktionstabellen();
    this.changeSelectedSpielerHandler(0);
    this.ballx = this.angriffspieler[2].x;
    this.bally = this.angriffspieler[2].y;
    this.ballwo = 2;
  }

  //Hilfsmethode um die Spieler zu Initialisieren. Kann wahrscheinlich auch in eine JSON
  initSpielers() {
    //Angriffspieler JSON einlesen
    let angriff = require('../assets/json/angriffspieler.json');
    //durch alle Spieler laufen und in angriffspieler pushen
    angriff.spieler.forEach(spieler => {
      this.angriffspieler.push(new Spieler(spieler.spieler_x, spieler.spieler_y, spieler.spieler_name));
    });
    //Abwehrspieler JSON einlesen
    let abwehr = require('../assets/json/abwehrspieler.json');
    //durch alle Spieler laufen und in abwehrspieler pushen
    abwehr.spieler.forEach(spieler => {
      this.abwehrspieler.push(new Spieler(spieler.spieler_x, spieler.spieler_y, spieler.spieler_name));
    });
    //selected Spieler auf den ersten Abwehrspieler setzen
  }

  //Initialisiere Regeln fuer Spieler aus einer JSON Datei
  initAktionstabellen() {
    //JSON einlesen
    let aktionstabellen = require('../assets/json/6_0_abwehr.json');
    //durch alle Spieler laufen und Regeln einspeichern
    aktionstabellen.spieler.forEach(spieler => {
      spieler.aktionstabelle.forEach(aktion =>{
        this.abwehrspieler[spieler.spieler_id].addAktion(aktion.ballwo, aktion.spielrichtung, aktion.bewegezu);
      })
    });
  }

  //Den aktuell bearbeitbaren Spieler wechseln
  changeSelectedSpielerHandler(abwehrspielerIndex: number) {
    this.selectedSpieler = this.abwehrspieler[abwehrspielerIndex];
  }

  //bewege einen Spieler
  bewegeSpieler(Spieler: Spieler, x: number, y: number){
    //neue x und y Werte
    Spieler.x = x;
    Spieler.y = y;
    //trigger die Animation
    Spieler.bewege = !Spieler.bewege;
  }

  /**
  Bewege den Ball einen weiter je nachdem
  in welche Richtung er gerade gespielt wird
  und welcher Spieler ihn gerade hat.
  */
  bewegeBall(){
    if(this.ballwo == 0){
      this.spielBallZu(1);
      this.spielrichtung = 0;
    } else if(this.ballwo == 1){
      if(this.spielrichtung == 1) this.spielBallZu(0);
      else this.spielBallZu(2);
    } else if(this.ballwo == 2){
      if(this.spielrichtung == 1) this.spielBallZu(1);
      else this.spielBallZu(3);
    } else if(this.ballwo == 3){
      if(this.spielrichtung == 1) this.spielBallZu(2);
      else this.spielBallZu(4);
    } else if(this.ballwo == 4){
      this.spielBallZu(3);
      this.spielrichtung = 1;
    }
  }

  /**
  aendere die Position des Balls zu dem Spieler zu dem er gespielt wurde
  und passe die ballwo an.
  */
  spielBallZu(SpielerIndex: number){
    this.ballx = this.angriffspieler[SpielerIndex].x;
    this.bally = this.angriffspieler[SpielerIndex].y;
    this.ballwo = SpielerIndex;
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
      this.bewegeBall();
      this.checkForSpielerbewegement();
      if (this.doLoop == true) this.loop();
    }, 750);
  }

  getBewegezu(aktionstabelle: any[], hinweise: any){
    for(let aktion of aktionstabelle){
      if(aktion.ballwo == hinweise.ballwo
        && aktion.spielrichtung == hinweise.spielrichtung){
          return aktion.bewegezu;
      }
    }
    return -1
  }

  //Aenderungen an der Bearbeitung der Aktionstabelle von selected Spieler bestaetigen.
  bestaetigeAenderungen(){
    //Werte aus den Dropdown Menues lesen.
    let ballwoselect: any = document.getElementsByName('ballwoselect');
    let spielrichtungselect: any = document.getElementsByName('spielrichtungselect');
    let bewegezuselect: any = document.getElementsByName('bewegezuselect');

    //neue Aktionstabelle
    let aktionstabelle: any = [];

    //Werte aus den Aktionen uebertragen in die Aktionstabelle.
    for(let index:number = 0; index < ballwoselect.length; index++){
      aktionstabelle.push({
        ballwo: ballwoselect[index].value,
        spielrichtung: spielrichtungselect[index].value,
        bewegezu: bewegezuselect[index].value})
    }

    //loesche dopplungen
    aktionstabelle = aktionstabelle.filter((aktion, index, self)=>
    self.findIndex(a =>
       a.ballwo === aktion.ballwo
       && a.spielrichtung === aktion.spielrichtung
       && a.bewegezu === aktion.bewegezu
     ) === index)

     //Aktionstabelle dem selectedSpieler geben
     this.selectedSpieler.aktionstabelle = aktionstabelle;

     //Entscheidungsbaum erstellen
     //erstelle komplette aktionstabelle ohne egal Werte
     //alle werte auffuellen
     let kompletteAktionstabelle: any = [];
     for(let ballwo: number = 0; ballwo < this.angriffspieler.length; ballwo++){
       for(let spielrichtung: number = 0; spielrichtung < 2; spielrichtung++){
         kompletteAktionstabelle.push({ballwo: ballwo, spielrichtung: spielrichtung, bewegezu: "-1"});
       }
     }
     console.log(kompletteAktionstabelle);
     //aendere bewegezu Werte mit folgender Prioritaet: nicht egal; spielrichtung egal; ballwo egal; alles egal;
  }

  //checkt ob ein Abwehrspieler sich bewegen muss und bewegt ihn dementsprechend.
  checkForSpielerbewegement(){
    let bewegezu: number = -1;
    for(let spieler of this.abwehrspieler){
      if(spieler.relevanzen.ballwo == true){
        //ballwo relevant
        if(spieler.relevanzen.spielrichtung == true){
          //spielrichtung relevant
          bewegezu = this.getBewegezu(spieler.aktionstabelle, {ballwo: this.ballwo, spielrichtung: this.spielrichtung})
        }
        else{
          //spielrichtung unrelevant
          bewegezu = this.getBewegezu(spieler.aktionstabelle, {ballwo: this.ballwo, spielrichtung: -1})
        }
      }
      else{
        //ballwo unrelevent
        if(spieler.relevanzen.spielrichtung == true){
          //spielrichtung relevant
          bewegezu = this.getBewegezu(spieler.aktionstabelle, {ballwo: -1, spielrichtung: this.spielrichtung})
        }
        else{
          //spielrichtung unrelevant
          bewegezu = this.getBewegezu(spieler.aktionstabelle, {ballwo: -1, spielrichtung: -1})
        }
      }
      if(bewegezu == -1){
        this.bewegeSpieler(spieler, spieler.startX, spieler.startY);
      }
      else{
        this.bewegeSpieler(spieler, this.angriffspieler[bewegezu].x, this.angriffspieler[bewegezu].y);
      }
    }
  }
}

//Klasse fuer Spieler
class Spieler {
  //startX und startY fuer das zurueckziehen an die Anfangsposition
  startX: number;
  startY: number;
  //veraenderbare aktuelle Position
  x: number;
  y: number;

  //Name des Spielers
  name: string;

  //Boolen Variable die bei jedem umaendern die Animation triggert.
  bewege: boolean = false;

  //aktuelle zu bearbeitende Aktion
  aktuelleAktion: number: 0;

  /**
  Die Aktionstabelle fuer diesen Spieler.
  Aktionen bestehen aus den beiden Bedingungen ballwo und spielrichtung
  und der eigentlichen Aktion mit bewegezu.
  Dabei sind ballwo und bewegezu die id fuer den Angriffspieler zu dem sich hinbewegt werden soll.
  Die Aktion in der 0 Zeile ist immer die Default Aktion mit ballwo = -1 und spielrichtung = -1.
  */
  aktionstabelle: any = [];

  //hier werden die Relevanzen fuer den Entscheidungsbaum gespeichert
  relevanzen: any = {
    ballwo: false,
    spielrichtung: false
  }

  //Konstruktor indem die Startposition und Name festgelegt wird
  constructor(x: number, y: number, name: string){
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;

    this.name = name;
  }

  //Methode zum hinzufuegen einer Regel.
  addAktion(ballwoIndex: number, spielrichtung: number, bewegezuIndex: number){
    this.aktionstabelle.push({
      ballwo: ballwoIndex,
      spielrichtung: spielrichtung,
      bewegezu: bewegezuIndex});
    this.checkRelevanzen();
  }

  //Methode zum hinzufuegen einer leeren Regel.
  addAktionLeer(){
    this.aktionstabelle.push({
      ballwo: -1,
      spielrichtung: -1,
      bewegezu: -1});
  }

  //Aktion loeschen
  removeAktion(aktion: any){
    this.aktionstabelle.splice(this.aktionstabelle.indexOf(aktion), 1);
  }

  setAktuelleAktion(aktion: any){
    this.aktuelleAktion = this.aktionstabelle.indexOf(aktionsIndex);
    console.log("aktuelle Aktion: " + this.aktuelleAktion);
  }

  //Methode zum aendern des Spielers der den Ball hat in einer Regel.
  changeBallwoInAktion(aktionUndBallSpielerIndex: any){
    //this.entscheidungsbaum[aktionUndBallSpielerIndex[0]].ballwoIndex = aktionUndBallSpielerIndex[2];
  }

  //Methode zum aendern des Spielers zu dem sich hinbewegt werden soll in einer Regel.
  changeBallrichtungInAktion(aktionUndBewegeSpielerIndex: any){
    /**if(aktionUndBewegeSpielerIndex[2] != "-"){
      this.entscheidungsbaum[aktionUndBewegeSpielerIndex[0]].bewegezuIndex = aktionUndBewegeSpielerIndex[2];
      this.entscheidungsbaum[aktionUndBewegeSpielerIndex[0]].backToStart = false;
    } else {
      this.entscheidungsbaum[aktionUndBewegeSpielerIndex[0]].backToStart = true;
    }*/
  }

  //Methode zum aendern des Spielers zu dem sich hinbewegt werden soll in einer Regel.
  changeBewegezuInAktion(aktionUndBewegeSpielerIndex: any){
    /**if(aktionUndBewegeSpielerIndex[2] != "-"){
      this.entscheidungsbaum[aktionUndBewegeSpielerIndex[0]].bewegezuIndex = aktionUndBewegeSpielerIndex[2];
      this.entscheidungsbaum[aktionUndBewegeSpielerIndex[0]].backToStart = false;
    } else {
      this.entscheidungsbaum[aktionUndBewegeSpielerIndex[0]].backToStart = true;
    }*/
  }

  checkRelevanzen(){
    let ballwo: boolean = false;
    let spielrichtung: boolean = false;
    for(let aktion of this.aktionstabelle){
      if(aktion.ballwo > -1){
        ballwo = true;
      }
      if(aktion.spielrichtung > -1){
        spielrichtung = true;
      }
    }
    this.relevanzen = {
      ballwo: ballwo,
      spielrichtung: spielrichtung
    }
  }
}
