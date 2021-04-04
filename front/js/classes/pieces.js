/**
 * @file Pieces Class
 * @version 1.0
 * @author Stratego Online
 */

/** Class used for each piece in the Table */
class Pieces {
  /**
   * Creates a Piece object that will be displayed in the 3D canvas
   * @param {number} spec id of the piece (0-11)
   * @param {number[]} position table[X, Y], both are between 0 and 9
   * @param {Object} mesh Piece mesh to display in the 3D scene 
   */
  constructor(spec, position, mesh) {
    /*
        +-----+-----+-----+-----+
        | 0,9 | 1,9 | ... | 9,9 |
        +-----+-----+-----+-----+
        | ... | ... | ... | ... |
        | 0,1 | 1,1 | ... | 9,1 |
        | 0,0 | 1,0 | ... | 9,0 |
        +-----+-----+-----+-----+
        */
        /* STATUS 
        * -1 = moving (not for a fight)
        *  0 = ded
        *  1 = alive
        *  2 = fight win (for animation) 
        *  3 = reveal win
        *  4 reveal ded
        */
    this.specc = spec;
    this.x = position[0];
    this.z = position[1];
    this.replacement = undefined;
    //this.physicalPiece = BABYLON.Mesh.CreateCylinder("cylinder", 1, 0.8, 0.8, 10, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    //cloning the base mesh:
    this.physicalPiece = mesh.clone("clonedPiece");
    //rescaling it, so it doesn't look like it's straight away from hell
    this.physicalPiece.scaling.x = 0.38;
    this.physicalPiece.scaling.y = 0.38;
    this.physicalPiece.scaling.z = 0.38;
    //making it looking in the right direction
    this.physicalPiece.rotation.y = Math.PI / 2;
    //settting up it's position
    this.physicalPiece.position.y = 0;
    this.physicalPiece.position.x = this.x * 0.835 - 3.757;
    this.physicalPiece.position.z = this.z * 0.835 - 3.757;
    this.status = 1;
  }

  //only moving the coordonate inside the class, not the physical piece
  move(x, z) {
    //not checking cause backend stuff
    this.x = x;
    this.z = z;
  }

  //check if the physical piece coords are the same as the coord (check if we need to move the physical piece)
  //return 0 if no difference, else it return the array with the difference coords
  check = () => {
    let retour = [0, 0];
    if (this.x * 0.835 - 3.757 != this.physicalPiece.position.x) {
      retour[0] = this.x * 0.835 - 3.757 - this.physicalPiece.position.x;
    }
    if (this.z * 0.835 - 3.757 != this.physicalPiece.position.z) {
      retour[1] = this.z * 0.835 - 3.757 - this.physicalPiece.position.z;
    }
    if (retour[0] == 0 && retour[1] == 0) return 0;
    return retour;
  };
}
