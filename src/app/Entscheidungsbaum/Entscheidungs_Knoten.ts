import { Frage } from "./Frage"

//zum abspeichern eines Entscheidungs_Knoten
export class Entscheidungs_Knoten {

  frage: Frage;

  rechts_ast: any;
  links_ast: any;

  constructor(frage, rechts_ast, links_ast){
    this.frage = frage;
    this.rechts_ast = rechts_ast;
    this.links_ast = links_ast;
  }
}
