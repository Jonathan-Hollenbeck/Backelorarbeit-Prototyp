//zum abspeicher eines Blattes
export class Blatt {

  //Array mit den Vorhersagen in diesem Blatt.
  vorhersage: any;

  constructor(vorhersage){
    this.vorhersage = vorhersage;
  }

  //ueberpruefe ob die Variable eine number ist
  istNumber(variable: any){
    if(isNaN(Number(variable))){
      return false;
    }
    return true;
  }

  //Hilfsfunktion zum ausgeben des Blattes
  ausgeben(){
    if(this.istNumber(this.vorhersage) == true){
      return this.vorhersage;
    }
    let ausgabe: String = "";
    for(let kombination of this.vorhersage){
      ausgabe += "[" + kombination + "]";
    }
    return ausgabe;
  }
}
