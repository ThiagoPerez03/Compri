// Este archivo exporta los datos para un árbol binario tipo Huffman/Fano-Shannon.
// Cada nodo tiene un 'id', un 'name' (la letra) y una propiedad 'code'
// que representa el valor ('0' o '1') del enlace que CONDUCE A ESE NODO desde su padre.
// La raíz no tendrá 'code'.

const huffmanTreeData = {
  id: 'root',
  name: ' ', // La raíz a menudo no tiene un valor visible en Huffman
  children: [
    {
      id: 'node-A',
      name: 'A',
      code: '0', // Borde de la raíz a A es '1'
      children: [
        { id: 'node-D', name: 'D', code: '0' }, // Borde de A a D es '0'
        { id: 'node-F', name: 'F', code: '1' }  // Borde de A a F es '1'
      ]
    },
    {
      id: 'node-B',
      name: 'B',
      code: '1', // Borde de la raíz a B es '0'
      children: [
        { id: 'node-C', name: 'C', code: '0' }, // Borde de B a C es '0'
        { id: 'node-E', name: 'E', code: '1' }  // Borde de B a E es '1'
      ]
    }
  ]
};


export default huffmanTreeData;