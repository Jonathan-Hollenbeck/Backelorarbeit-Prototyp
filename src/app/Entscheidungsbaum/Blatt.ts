//zum abspeicher eines Blattes
export class Blatt {

  vorhersage: number;

  constructor(vorhersage){
    this.vorhersage = vorhersage;
  }

  ausgeben(){
    let ausgabe: String = "";
    for(let kombination of this.vorhersage){
      ausgabe += "[" + kombination + "]";
    }
    return ausgabe;
  }
}
