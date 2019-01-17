//zum abspeicher der Fragen
export class Frage {

  spalte: number;

  wert: any;

  kopfzeile: any;

  constructor(spalte, wert, kopfzeile){
    this.spalte = spalte;
    this.wert = wert;
    this.kopfzeile = kopfzeile;
  }

  //ueberpruefe ob die Variable eine number ist
  istNumber(variable: any){
    if(isNaN(Number(variable))){
      return false;
    }
    return true;
  }

  //Vergleiche das Merkmal im Beispiel mit dem dieser Frage
  entspricht(beispiel){
    let wert: any = beispiel[this.spalte];
    if(this.istNumber(wert)){
      return wert >= this.wert;
    }
    return wert == this.wert;
  }

  //das ist eine Hilfmethode fuer die ausgabe des gesammten Baums
  ausgeben(){
    let kondition = "=="
    if(this.istNumber(this.wert)){
      kondition = ">=";
    }
    return String("Ist " + this.kopfzeile[this.spalte] + " " + kondition + " " + this.wert);
  }
}
