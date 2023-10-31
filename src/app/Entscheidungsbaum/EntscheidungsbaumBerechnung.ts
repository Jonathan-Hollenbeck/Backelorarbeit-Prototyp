import { Frage } from "./Frage"
import { Blatt } from "./Blatt"
import { Entscheidungs_Knoten } from "./Entscheidungs_Knoten"

export class EntscheidungsbaumBerechnung {

  //Variablen zur findung des richtigen Indexes in Aktionen
  ballwoIndex: number = 0;
  spielrichtungIndex: number = 1;
  bewegezuIndex: number = 2;

  //kopfzeile in der alle Attribute stehen.
  kopfzeile: any;

  berechneEntscheidungsbaum(aktionstabelle: any, kopfzeile: any){
    this.kopfzeile = kopfzeile;

    //Wenn die Kopfzeile und die Aktionstabelle unterschiedlich viele Attribute haben wird abgebrochen
    if(aktionstabelle[0].length != kopfzeile.length){
      console.log("Kopfzeile hat nicht gleiche laenge!")
      return null;
    }

    //gebe den gebauten Baum zurueck
    return this.baue_baum(aktionstabelle);
  }

  //Die einzelnen Moeglichkeiten fuer eine Spalte finden
  einzigartigeWerte(daten: any, spalte: number){
    //Array zum abspeichern der Werte.
    let einzigartigeWerte: any = [];
    //for-Schleife die einmal durch alle Zeilen des Datensatzes geht.
    for(let zeile of daten){
      //Wenn der Wert noch nicht im Array ist nimm ihn auf.
      if(!einzigartigeWerte.includes(zeile[spalte])){
        einzigartigeWerte.push(zeile[spalte]);
      }
    }
    //gebe Array mit Werten zurueck
    return einzigartigeWerte;
  }

  //zaehlt die Anzahl die eine Bewegung vorkommt.
  bewegungsZaehler(daten: any){
    //eine Klasse in der gezaehlt wird
    let zaehler: {[k: string]: any} = {}
    //Variable die den Wert in der Spalte annimmt, in der der Output Wert steht.
    let etikett: number = 0;
    //for-Schleife die einmal durch alle Zeilen des Datensatzes geht.
    for(let zeile of daten){
      //etikett nimmt den Wert von dem Output Wert in dieser Zeile an.
      etikett = zeile[this.bewegezuIndex];
      //Wenn dieser Output Wert noch nicht vorhanden ist, fuege ihn hinzu
      if (zaehler[etikett] == null) {
        zaehler[etikett] = 0;
      }
      //inkrementiere den zahler fuer diesen Output Wert.
      zaehler[etikett] += 1;
    }
    //gebe Klasse mit allen Zaehlern zurueck.
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
    //erstelle Arrays in denen die Aufgeteilten Daten gespeichert werden.
    let wahr_daten: any = [];
    let falsch_daten: any = [];
    //for-Schleife, die durch alle Zeilen des Datensatzes geht
    for(let datum of daten){
      //ueberpruefe ob die Frage wahr oder falsch beantworted wurde und
      //speicher das Datum dann in das entsprechende Array
      if(frage.testen(datum)){
        wahr_daten.push(datum);
      }
      else{
        falsch_daten.push(datum);
      }
    }
    //gebe eine Klasse mit den Speicherarrays in eineer Klasse zurueck
    return {wahr: wahr_daten, falsch: falsch_daten};
  }

  //berechnet die gini impurity fuer die daten
  gini(daten: any){
    //zaehle wie oft eine bewegung vorkommt und speicher das in eine Variable.
    let zaehler: any = this.bewegungsZaehler(daten);
    //Variable die am Ende die impurity angibt.
    let impurity: number = 1;
    //Variable die die Wahrscheinlichkeit angibt, dass ein Attribut zufaellig ausgewaehlt wird.
    let wahr_von_bewegung: number = 0;
    //for-Schleife, die durch alle Bewegungen geht, die in zaehler vorhanden sind.
    for(let bewegung of Object.keys(zaehler)){
      //berechne Wahrscheinlichkeit fuer aktuelle bewegung
      wahr_von_bewegung = zaehler[bewegung] / daten.length;
      //ziehe die quadratische Wahrscheinlichkeit von der impurity ab.
      impurity -= wahr_von_bewegung**2;
    }
    //gebe die abschliessende impurity zurueck
    return impurity;
  }

  //berechnet den Informationsgehalt eines Knoten
  informationsgehalt(links, rechts, mom_unsicherheit){
    //rechne eine Gewichtung fuer den linken Teilbaum aus.
    let wahr: number = links.length / (links.length + rechts.length);
    //ziehe von der Momentanen Unsichert die gewichteten Gini impurities ab. und gebe das zurueck.
    return mom_unsicherheit - (wahr * this.gini(links)) - ((1 - wahr) * this.gini(rechts));
  }

  //findet die beste Teilung an diesem Knoten
  finde_beste_teilung(daten){
    //Variablen zum abspeichern vom Momentanen besten gehalt und der Momentanen besten Frage.
    let bester_gehalt: number = 0;
    let beste_frage: Frage;
    //die Momentanen Unsichert ist die Gini impurity von den aktuellen Daten.
    let mom_unsicherheit: number = this.gini(daten);
    //Anzahl an Spalten
    let spalten_anzahl: number = daten[0].length - 1;

    //for-Schleife geht durch alle Spalten
    for(let spalte: number = 0; spalte < spalten_anzahl; spalte++){
      //Variable in der alle einzigartige Werte dieser Spalte abgespeichert werden.
      let werte = this.einzigartigeWerte(daten, spalte);

      //for-Schleife die durch alle Werte in werte geht.
      for(let wert of werte){
        //Variablen um Fragen und Teilungen zu testen.
        let frage: Frage = new Frage(spalte, wert, this.kopfzeile);
        let teilung: any = this.teilen(daten, frage);

        //Es werden Teilungen herausgefiltert, die keine Teilung erbringen
        if(teilung.wahr.length > 0 && teilung.falsch.length > 0){
          //informationsgehalt fuer diese Teilung berechnen.
          let gehalt: number = this.informationsgehalt(teilung.wahr, teilung.falsch, mom_unsicherheit);

          //wenn der berechnete Gehalt groesser ist wird die Frage und der Gehalt als die besten markiert.
          if(gehalt >= bester_gehalt){
            bester_gehalt = gehalt;
            beste_frage = frage;
          }
        }
      }
    }
    //der beste Gehalt mit der besten Frage wird zurueck gegeben.
    return {bester_gehalt: bester_gehalt, beste_frage: beste_frage};
  }

  //den Baum bauen
  baue_baum(daten: any){
    //Die beste Teilung fuer den Knoten finden.
    let beste_teilung: any = this.finde_beste_teilung(daten);

    //Wenn der beste gehalt des Knoten 0 ist ist es ein Blatt.
    if(beste_teilung.bester_gehalt == 0){
      return new Blatt(daten);
    }

    //aufteilen der daten mit der besten Frage.
    let teilung: any = this.teilen(daten, beste_teilung.beste_frage);

    //rekursiv rechts und links bauen indem ihnen ihre teilungen gegeben werden.
    let rechts_ast: any = this.baue_baum(teilung.wahr);
    let links_ast: any = this.baue_baum(teilung.falsch);

    //Wenn es kein Blatt ist, wird ein neuer Knoten zurueck gegeben.
    return new Entscheidungs_Knoten(beste_teilung.beste_frage, rechts_ast, links_ast);
  }

  //pruefe ob knoten ein Blatt ist
  ist_blatt(knoten){
    return knoten instanceof Blatt
  }

  //baum ausgeben
  gebe_baum_aus(knoten, abstand){
    //gibt rekursiv den Baum aus.
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

  //klassifizieren eines Objektes
  klassifizieren(zeile, knoten){
    //Wenn ein Blatt erreicht wurde, gib die Vorhersage dieses Blattes aus.
    if(this.ist_blatt(knoten) == true){
      return knoten.vorhersage
    }

    //rekursives klassifizieren indem die Aktuelle Frage mit dem Objekt getestet wird und
    //dann an den dem entsprechenden Ast weitergemacht wird.
    if(knoten.frage.testen(zeile) == true){
      return this.klassifizieren(zeile, knoten.rechts_ast);
    }
    else{
      return this.klassifizieren(zeile, knoten.links_ast);
    }
  }
}
