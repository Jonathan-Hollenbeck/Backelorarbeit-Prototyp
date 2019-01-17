import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, style, transition } from '@angular/animations'
import { Spieler } from "./Spieler"
import { EntscheidungsbaumBerechnung } from "./EntscheidungsbaumBerechnung"

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

  //Variablen zur findung des richtigen Indexes in Aktionen
  ballwoIndex: number = 0;
  spielrichtungIndex: number = 1;
  bewegezuIndex: number = 2;

  //Construktor indem die Spieler, Regeln und der Ball initialisiert werden.
  ngOnInit() {
    console.log("app.component.ts");
    this.initSpieler();
    this.initAktionstabellen();
    this.changeSelectedSpielerHandler(0);
    this.ballx = this.angriffspieler[2].x;
    this.bally = this.angriffspieler[2].y;
    this.ballwo = 2;
  }

  //Hilfsmethode um die Spieler zu Initialisieren. Kann wahrscheinlich auch in eine JSON
  initSpieler() {
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
        this.abwehrspieler[spieler.spieler_id].addAktion(aktion);
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

  vglArrays(array1: any, array2: any){
    if(array1.length != array2.length){
      return false;
    }
    for(let index: number = 0; index < array1.length; index++){
      if(array1[index] != array2[index]){
        return false;
      }
    }
    return true;
  }

  loescheDopplungenAusDoppelArray(array){
    for(let elementIndex: number = 0; elementIndex < array.length; elementIndex++){
      for(let vglIndex: number = elementIndex; vglIndex < array.length; vglIndex++){
        if(elementIndex != vglIndex && this.vglArrays(array[elementIndex], array[vglIndex]) == true){
          vglIndex--;
        }
      }
    }
    return array;
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
      aktionstabelle.push([
        ballwoselect[index].value,
        spielrichtungselect[index].value,
        bewegezuselect[index].value])
    }

    aktionstabelle = this.loescheDopplungenAusDoppelArray(aktionstabelle);

    //Aktionstabelle dem selectedSpieler geben
    this.selectedSpieler.aktionstabelle = Object.assign([], aktionstabelle);
    //Entscheidungsbaum erstellen
    //komplette Aktionstabelle erstellen ohne egal Werte
    let kompletteAktionstabelle: any = [];
    kompletteAktionstabelle = this.egalWerteExpandieren(kompletteAktionstabelle, aktionstabelle);

    let entscheidungsbaum = new EntscheidungsbaumBerechnung();

    entscheidungsbaum.berechneEntscheidungsbaum(kompletteAktionstabelle, ["ballwo", "spielrichtung", "bewegezu"]);
  }

  //erstelle komplette aktionstabelle ohne egal Werte
  egalWerteExpandieren(kompletteAktionstabelle: any, aktionstabelle: any){
    //alle werte auffuellen
    for(let ballwo: number = 0; ballwo < this.angriffspieler.length; ballwo++){
      for(let spielrichtung: number = 0; spielrichtung < 2; spielrichtung++){
        kompletteAktionstabelle.push([ballwo, spielrichtung, -1]);
      }
    }
    //bei leerer Aktionstabelle nichts aendern
    if(aktionstabelle.length > 0){
      //aendere bewegezu Werte mit folgender Prioritaet: nicht egal; spielrichtung egal; ballwo egal; alles egal;
      //aendere fuer alles egal
      let allesegal = aktionstabelle.find(aktion => aktion[this.ballwoIndex] == -1 && aktion[this.spielrichtungIndex] == -1);
      //loeschen der allesegal Aktion
      aktionstabelle.splice(aktionstabelle.indexOf(allesegal), 1);
      for(let aktion of kompletteAktionstabelle){
        aktion[this.bewegezuIndex] = allesegal[this.bewegezuIndex];
      }
      //aendere fuer spielrichtung egal
      let ballwoegal = aktionstabelle.filter(aktion => aktion[this.ballwoIndex] == -1)
      //loeschen der spielrichtungegal Aktionen
      for(let ballwoe of ballwoegal){
        aktionstabelle.splice(aktionstabelle.indexOf(ballwoe), 1);
      }
      for(let aktion1 of kompletteAktionstabelle){
        for(let aktion2 of ballwoegal){
          if(aktion1[this.spielrichtungIndex] == aktion2[this.spielrichtungIndex]){
            aktion1[this.bewegezuIndex] = aktion2[this.bewegezuIndex];
          }
        }
      }
      //aendere fuer ballwo egal
      let spielrichtungegal = aktionstabelle.filter(aktion => aktion[this.spielrichtungIndex] == -1)
      //loeschen der ballwoegal Aktionen
      for(let spielrichtunge of spielrichtungegal){
        aktionstabelle.splice(aktionstabelle.indexOf(spielrichtunge), 1);
      }
      for(let aktion1 of kompletteAktionstabelle){
        for(let aktion2 of spielrichtungegal){
          if(aktion1[this.ballwoIndex] == aktion2[this.ballwoIndex]){
            aktion1[this.bewegezuIndex] = aktion2[this.bewegezuIndex];
          }
        }
      }
      //aendere fuer nicht egal
      for(let aktion1 of kompletteAktionstabelle){
        for(let aktion2 of aktionstabelle){
          if(aktion1[this.ballwoIndex] == aktion2[this.ballwoIndex]
            && aktion1[this.spielrichtungIndex] == aktion2[this.spielrichtungIndex]){
            aktion1[this.bewegezuIndex] = aktion2[this.bewegezuIndex];
          }
        }
      }
    }
    return kompletteAktionstabelle;
  }

  //checkt ob ein Abwehrspieler sich bewegen muss und bewegt ihn dementsprechend.
  checkForSpielerbewegement(){
    console.log("NO CODE checkForSpielerbewegement")
  }
}
