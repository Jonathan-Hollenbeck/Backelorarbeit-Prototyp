import { Entscheidungs_Knoten } from "./Entscheidungsbaum/Entscheidungs_Knoten"
//Klasse fuer Spieler
export class Spieler {
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

  /**
  Die Aktionstabelle fuer diesen Spieler.
  Aktionen bestehen aus den beiden Bedingungen ballwo und spielrichtung
  und der eigentlichen Aktion mit bewegezu.
  Dabei sind ballwo und bewegezu die id fuer den Angriffspieler zu dem sich hinbewegt werden soll.
  Die Aktion in der 0 Zeile ist immer die Default Aktion mit ballwo = -1 und spielrichtung = -1.
  */
  aktionstabelle: any = [];

  //Variablen zur findung des richtigen Indexes in Aktionen
  ballwoIndex: number = 0;
  spielrichtung: number = 1;
  bewegezuIndex: number = 2;

  //entscheidungsbaum
  entscheidungsbaum: any;

  //Konstruktor indem die Startposition und Name festgelegt wird
  constructor(x: number, y: number, name: string){
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;

    this.name = name;
  }

  //Methode zum hinzufuegen einer Regel.
  addAktion(aktion: any){
    this.aktionstabelle.push(aktion);
  }

  //Methode zum hinzufuegen einer leeren Regel.
  addAktionLeer(){
    this.aktionstabelle.push([-1,-1,-1]);
  }

  //Aktion loeschen
  removeAktion(aktion: any){
    this.aktionstabelle.splice(this.aktionstabelle.indexOf(aktion), 1);
  }
}
