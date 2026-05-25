import { CGFobject } from "../CGF.js";

/*
CGFobjModel class
Loads a .obj file and parses it to create the corresponding model. The .obj
file is expected to be in the same format as the one exported by Blender, which
is a common format for 3D models.

Use:
 this.suzanne = new CGFobjModel(this, "models/suzanne.obj");

 ...
 this.suzanne.display();
 
*/
export class CGFobjModel extends CGFobject {
  /*
   * constructor(scene, modelUrl)
   * scene: the CGFscene to which this model belongs
   * modelUrl: the URL of the .obj file containing the model data
   */
  constructor(scene, modelUrl) {
    super(scene);
    this.modelData = null;
    this.ready = false;
    (async () => {
      try {
        const response = await fetch(modelUrl);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        this.loadData(await response.text());
        this.initBuffers();
      } catch (error) {
        console.error(`Failed to load OBJ model ${modelUrl}:`, error);
      }
    })();
  }

  generateNormalsFromGeometry(modelData) {
    const generatedNormals = new Array(modelData.verts.length).fill(0);

    for (let i = 0; i < modelData.indices.length; i += 3) {
      const index0 = modelData.indices[i] * 3;
      const index1 = modelData.indices[i + 1] * 3;
      const index2 = modelData.indices[i + 2] * 3;

      const ax = modelData.verts[index1] - modelData.verts[index0];
      const ay = modelData.verts[index1 + 1] - modelData.verts[index0 + 1];
      const az = modelData.verts[index1 + 2] - modelData.verts[index0 + 2];

      const bx = modelData.verts[index2] - modelData.verts[index0];
      const by = modelData.verts[index2 + 1] - modelData.verts[index0 + 1];
      const bz = modelData.verts[index2 + 2] - modelData.verts[index0 + 2];

      const normalX = ay * bz - az * by;
      const normalY = az * bx - ax * bz;
      const normalZ = ax * by - ay * bx;

      generatedNormals[index0] += normalX;
      generatedNormals[index0 + 1] += normalY;
      generatedNormals[index0 + 2] += normalZ;
      generatedNormals[index1] += normalX;
      generatedNormals[index1 + 1] += normalY;
      generatedNormals[index1 + 2] += normalZ;
      generatedNormals[index2] += normalX;
      generatedNormals[index2 + 1] += normalY;
      generatedNormals[index2 + 2] += normalZ;
    }

    for (let i = 0; i < generatedNormals.length; i += 3) {
      const length = Math.hypot(generatedNormals[i], generatedNormals[i + 1], generatedNormals[i + 2]);
      if (length > 0) {
        generatedNormals[i] /= length;
        generatedNormals[i + 1] /= length;
        generatedNormals[i + 2] /= length;
      }
    }

    return generatedNormals;
  }

  loadData(objectData) {
    /*
     The OBJ file format does a sort of compression when saving a model in a
     program like Blender. There are at least 3 sections (4 including textures)
     within the file. Each line in a section begins with the same string:
       * 'v': indicates vertex section
       * 'vn': indicates vertex normal section
       * 'f': indicates the faces section
       * 'vt': indicates vertex texture section (if textures were used on the model)
     Each of the above sections (except for the faces section) is a list/set of
     unique vertices.

     Each line of the faces section contains a list of
     (vertex, [texture], normal) groups
     Some examples:
         // the texture index is optional, both formats are possible for models
         // without a texture applied
         f 1/25 18/46 12/31
         f 1//25 18//46 12//31

         // A 3 vertex face with texture indices
         f 16/92/11 14/101/22 1/69/1

         // A 4 vertex face
         f 16/92/11 40/109/40 38/114/38 14/101/22

     The first two lines are examples of a 3 vertex face without a texture applied.
     The second is an example of a 3 vertex face with a texture applied.
     The third is an example of a 4 vertex face. Note: a face can contain N
     number of vertices.

     Each number that appears in one of the groups is a 1-based index
     corresponding to an item from the other sections (meaning that indexing
     starts at one and *not* zero).

     For example:
         `f 16/92/11` is saying to
           - take the 16th element from the [v] vertex array
           - take the 92nd element from the [vt] texture array
           - take the 11th element from the [vn] normal array
         and together they make a unique vertex.
     Using all 3+ unique Vertices from the face line will produce a polygon.

     Now, you could just go through the OBJ file and create a new vertex for
     each face line and WebGL will draw what appears to be the same model.
     However, vertices will be overlapped and duplicated all over the place.

     Consider a cube in 3D space centered about the origin and each side is
     2 units long. The front face (with the positive Z-axis pointing towards
     you) would have a Top Right vertex (looking orthogonal to its normal)
     mapped at (1,1,1) The right face would have a Top Left vertex (looking
     orthogonal to its normal) at (1,1,1) and the top face would have a Bottom
     Right vertex (looking orthogonal to its normal) at (1,1,1). Each face
     has a vertex at the same coordinates, however, three distinct vertices
     will be drawn at the same spot.

     To solve the issue of duplicate Vertices (the `(vertex, [texture], normal)`
     groups), while iterating through the face lines, when a group is encountered
     the whole group string ('16/92/11') is checked to see if it exists in the
     packed.hashindices object, and if it doesn't, the indices it specifies
     are used to look up each attribute in the corresponding attribute arrays
     already created. The values are then copied to the corresponding unpacked
     array (flattened to play nice with WebGL's ELEMENT_ARRAY_BUFFER indexing),
     the group string is added to the hashindices set and the current unpacked
     index is used as this hashindices value so that the group of elements can
     be reused. The unpacked index is incremented. If the group string already
     exists in the hashindices object, its corresponding value is the index of
     that group and is appended to the unpacked indices array.
     */
    var verts = [];
    var normals = [];
    var textures = [];
    var unpacked = {};

    // unpacking stuff
    unpacked.verts = [];
    unpacked.normals = [];
    unpacked.textures = [];
    unpacked.hashindices = {};
    unpacked.indices = [];
    unpacked.index = 0;
    // array of lines separated by the newline
    var lines = objectData.split("\n");

    var VERTEX_RE = /^v\s/;
    var NORMAL_RE = /^vn\s/;
    var TEXTURE_RE = /^vt\s/;
    var FACE_RE = /^f\s/;
    var WHITESPACE_RE = /\s+/;
    var hasFaceNormals = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      var elements = line.split(WHITESPACE_RE);
      elements.shift();

      if (VERTEX_RE.test(line)) {
        // if this is a vertex
        verts.push.apply(verts, elements);
      } else if (NORMAL_RE.test(line)) {
        // if this is a vertex normal
        normals.push.apply(normals, elements);
      } else if (TEXTURE_RE.test(line)) {
        // if this is a texture
        textures.push.apply(textures, elements);
      } else if (FACE_RE.test(line)) {
        // if this is a face
        /*
        split this face into an array of vertex groups
        for example:
           f 16/92/11 14/101/22 1/69/1
        becomes:
          ['16/92/11', '14/101/22', '1/69/1'];
        */
        var quad = false;
        for (var j = 0, eleLen = elements.length; j < eleLen; j++) {
          // Triangulating quads
          // quad: 'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2 v3/t3/vn3/'
          // corresponding triangles:
          //      'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2'
          //      'f v2/t2/vn2 v3/t3/vn3 v0/t0/vn0'
          if (j === 3 && !quad) {
            // add v2/t2/vn2 in again before continuing to 3
            j = 2;
            quad = true;
          }
          if (elements[j] in unpacked.hashindices) {
            unpacked.indices.push(unpacked.hashindices[elements[j]]);
          } else {
            /*
                Each element of the face line array is a vertex which has its
                attributes delimited by a forward slash. This will separate
                each attribute into another array:
                    '19/92/11'
                becomes:
                    vertex = ['19', '92', '11'];
                where
                    vertex[0] is the vertex index
                    vertex[1] is the texture index
                    vertex[2] is the normal index
                 Think of faces having Vertices which are comprised of the
                 attributes location (v), texture (vt), and normal (vn).
                 */
              var vertex = elements[j].split("/");
              var vertexIndex = parseInt(vertex[0], 10);
              var textureIndex = vertex.length > 1 && vertex[1] !== "" ? parseInt(vertex[1], 10) : null;
              var normalIndex = vertex.length > 2 && vertex[2] !== "" ? parseInt(vertex[2], 10) : null;
            /*
                 The verts, textures, and normals arrays each contain a
                 flattend array of coordinates.

                 Because it gets confusing by referring to vertex and then
                 vertex (both are different in my descriptions) I will explain
                 what's going on using the vertexNormals array:

                 vertex[2] will contain the one-based index of the vertexNormals
                 section (vn). One is subtracted from this index number to play
                 nice with javascript's zero-based array indexing.

                 Because vertexNormal is a flattened array of x, y, z values,
                 simple pointer arithmetic is used to skip to the start of the
                 vertexNormal, then the offset is added to get the correct
                 component: +0 is x, +1 is y, +2 is z.

                 This same process is repeated for verts and textures.
                 */
            // vertex position
                unpacked.verts.push(+verts[(vertexIndex - 1) * 3 + 0]);
                unpacked.verts.push(+verts[(vertexIndex - 1) * 3 + 1]);
                unpacked.verts.push(+verts[(vertexIndex - 1) * 3 + 2]);

            // vertex textures
            if (textures.length) {
                  if (textureIndex !== null) {
                    unpacked.textures.push(+textures[(textureIndex - 1) * 2 + 0]);
                    unpacked.textures.push(1 - +textures[(textureIndex - 1) * 2 + 1]);
                  } else {
                    unpacked.textures.push(0);
                    unpacked.textures.push(0);
                  }
            }

            // vertex normals
                if (normalIndex !== null && normals.length) {
                  unpacked.normals.push(+normals[(normalIndex - 1) * 3 + 0]);
                  unpacked.normals.push(+normals[(normalIndex - 1) * 3 + 1]);
                  unpacked.normals.push(+normals[(normalIndex - 1) * 3 + 2]);
                  hasFaceNormals = true;
                } else {
                  unpacked.normals.push(0);
                  unpacked.normals.push(0);
                  unpacked.normals.push(0);
                }

            // add the newly created vertex to the list of indices
            unpacked.hashindices[elements[j]] = unpacked.index;
            unpacked.indices.push(unpacked.index);

            // increment the counter
            unpacked.index += 1;
          }
          if (j === 3 && quad) {
            // add v0/t0/vn0 onto the second triangle
            unpacked.indices.push(unpacked.hashindices[elements[0]]);
          }
        }
      }
    }
    if (!hasFaceNormals || !normals.length) {
      unpacked.normals = this.generateNormalsFromGeometry(unpacked);
    }
    this.modelData = unpacked;
  }

  /*
   * initBuffers()
   * Initializes the WebGL buffers corresponding to the model data. This method
   * is called after the model data is loaded and parsed, and it creates the
   * buffers for the vertices, normals, textures, and indices that will be used
   * to render the model in WebGL.
   */
  initBuffers() {
    this.vertices = this.modelData.verts;
    this.indices = this.modelData.indices;
    this.normals = this.modelData.normals;
    this.texCoords = this.modelData.textures;
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
    this.ready = true;
  }

  /*
   * display()
   * Overrides the display method of CGFobject to ensure that the model is only
   * rendered once it is fully loaded and the buffers are initialized. If the model is not ready, the display method will not attempt to render it, preventing
   * errors and ensuring that the scene is only drawn when the model data is available.
   */
  display() {
    if (this.ready) super.display();
  }
}
