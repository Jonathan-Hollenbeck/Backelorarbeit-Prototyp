import { Frage } from "./Frage"
import { Blatt } from "./Blatt"
import { Entscheidungs_Knoten } from "./Entscheidungs_Knoten"

export class EntscheidungsbaumBerechnung {

  //Variable in dem der Entscheidungsbaum abgespeichert wird.
  entscheidungsbaum: any;

  //Variablen zur findung des richtigen Indexes in Aktionen
  ballwoIndex: number = 0;
  spielrichtungIndex: number = 1;
  bewegezuIndex: number = 2;

  //kopfzeile
  kopfzeile: any;

  berechneEntscheidungsbaum(aktionstabelle: any, kopfzeile: any){
    this.kopfzeile = kopfzeile;

    if(aktionstabelle[0].length != kopfzeile.length){
      console.log("Kopfzeile hat nicht gleiche laenge!")
      return null;
    }

    return baue_baum(aktionstabelle);
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

  //teilen der Daten in wahr und falsch
  teilen(daten: any, frage: Frage){
    let wahr_daten: any = [];
    let falsch_daten: any = [];
    for(let datum of daten){
      if(frage.testen(datum)){
        wahr_daten.push(datum);
      }
      else{
        falsch_daten.push(datum);
      }
    }
    return {wahr: wahr_daten, falsch: falsch_daten};
  }

  //berechnet die gini impurity fuer die daten
  gini(daten: any){
    let zaehler: any = this.bewegungsZaehler(daten);
    let impurity: number = 1;
    let wahr_von_bewegung: number = 0;
    for(let bewegung of Object.keys(zaehler)){
      wahr_von_bewegung = zaehler[bewegung] / daten.length;
      impurity -= wahr_von_bewegung**2;
    }
    return impurity;
  }

  //berechnet den Informationsgehalt eines Knoten
  informationsgehalt(links, rechts, mom_unsicherheit){
    let wahr: number = links.length / (links.length + rechts.length);
    return mom_unsicherheit - (wahr * this.gini(links)) - ((1 - wahr) * this.gini(rechts));
  }

  //findet die beste Teilung an diesem Knoten
  finde_beste_teilung(daten){
    let bester_gehalt: number = 0;
    let beste_frage: Frage;
    let mom_unsicherheit: number = this.gini(daten);
    let spalten_anzahl: number = daten[0].length - 1;

    for(let spalte: number = 0; spalte < spalten_anzahl; spalte++){
      let werte = this.einzigartigeWerte(daten, spalte);

      for(let wert of werte){
        let frage: Frage = new Frage(spalte, wert, this.kopfzeile);
        let teilung: any = this.teilen(daten, frage);

        if(teilung.wahr.length > 0 && teilung.falsch.length > 0){
          let gehalt: number = this.informationsgehalt(teilung.wahr, teilung.falsch, mom_unsicherheit);

          if(gehalt >= bester_gehalt){
            bester_gehalt = gehalt;
            beste_frage = frage;
          }
        }
      }
    }
    return {bester_gehalt: bester_gehalt, beste_frage: beste_frage};
  }

  //den Baum bauen
  baue_baum(daten: any){
    let beste_teilung: any = this.finde_beste_teilung(daten);

    if(beste_teilung.bester_gehalt == 0){
      return new Blatt(daten);
    }

    let teilung: any = this.teilen(daten, beste_teilung.beste_frage);

    let rechts_ast: any = this.baue_baum(teilung.wahr);
    let links_ast: any = this.baue_baum(teilung.falsch);

    return new Entscheidungs_Knoten(beste_teilung.beste_frage, rechts_ast, links_ast);
  }

  //pruefe ob knoten ein Blatt ist
  ist_blatt(knoten){
    return knoten instanceof Blatt
  }

  //baum ausgeben
  gebe_baum_aus(knoten, abstand){
    if(this.ist_blatt(knoten) == true){
      console.log(abstand + "Vorhersage: " + knoten.ausgeben());
      return;
    }

    console.log(abstand + "" + knoten.frage.ausgeben());

    console.log(abstand + "--> Wahr:");
    this.gebe_baum_aus(knoten.rechts_ast, abstand + "  ");

    console.log(abstand + "--> Falsch:");
    this.gebe_baum_aus(knoten.links_ast, abstand + "  ");
  }

  //klassifizieren
  klassifizieren(zeile, knoten){
    if(this.ist_blatt(knoten) == true){
      return knoten.vorhersage
    }

    if(knoten.frage.testen(zeile) == true){
      return this.klassifizieren(zeile, knoten.rechts_ast);
    }
    else{
      return this.klassifizieren(zeile, knoten.links_ast);
    }
  }
}
