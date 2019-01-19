//zum abspeicher eines Blattes
export class Blatt {

  vorhersage: number[];

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
