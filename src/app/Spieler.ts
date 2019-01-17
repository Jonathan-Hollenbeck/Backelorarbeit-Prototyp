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

  //aktuelle zu bearbeitende Aktion
  aktuelleAktion: number = 0;

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
}
