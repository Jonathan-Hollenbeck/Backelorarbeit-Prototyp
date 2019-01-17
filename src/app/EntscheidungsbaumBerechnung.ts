export class EntscheidungsbaumBerechnung {

  //variable in dem der Entscheidungsbaum abgespeichert wird.
  entscheidungsbaum: any;

  //Variablen zur findung des richtigen Indexes in Aktionen
  ballwoIndex: number = 0;
  spielrichtungIndex: number = 1;
  bewegezuIndex: number = 2;

  berechneEntscheidungsbaum(aktionstabelle: any, kopfzeile: any){
    if(aktionstabelle[0].length != kopfzeile.length){
      console.log("Kopfzeile hat nicht gleiche laenge!")
      return null;
    }

    console.log(aktionstabelle);

    for(let i: number = 0; i < aktionstabelle[0].length; i++){
      console.log(this.einzigartigeWerte(aktionstabelle, i));
    }

    console.log(this.bewegungsZaehler(aktionstabelle))

        console.log(this.istNumber(1))
            console.log(this.istNumber("123"))
                console.log(this.istNumber("fsdfs"))
                    console.log(this.istNumber("sdfsfdd123"))
  }

  //Die einzelnen Moeglichkeiten fuer jede Spalte finden
  einzigartigeWerte(daten: any, spalte: number){
    let einzigartigeWerte: any = [];
    for(let zeile of daten){
      if(!einzigartigeWerte.includes(zeile[spalte])){
        einzigartigeWerte.push(zeile[spalte]);
      }
    }
    return einzigartigeWerte;
  }

  //zaehlt die Anzahl die eine Bewegung vorkommt.
  bewegungsZaehler(daten: any){
    let zaehler: {[k: string]: any} = {}
    let etikett: number = 0;
    for(let zeile of daten){
      etikett = zeile[this.bewegezuIndex];
      if (zaehler[etikett] == null) {
        zaehler[etikett] = 0;
      }
      zaehler[etikett] += 1;
    }
    return zaehler;
  }

  //ueberpruefe ob die Variable eine number ist
  istNumber(variable: any){
    if(isNaN(Number(variable))){
      return false;
    }
    return true;
  }
}
