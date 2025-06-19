const huffmanTreeData = {
  id: 'root',
  name: '', 
  children: [
    {
      id: 'node-A',
      name: '',
      code: '0',
      codigo: '10', 
      frecuencia: 240,
      probabilidad: 0.240,
      children: [
        { id: 'node-D', name: 'A', code: '0', codigo: '1100', frecuencia: 51, probabilidad: 0.051 },
        { id: 'node-F', name: 'B', code: '1', codigo: '1101', frecuencia: 49, probabilidad: 0.049 }
      ]
    },
    {
      id: 'node-B',
      name: '',
      code: '1',
      codigo: '001',
      frecuencia: 140,
      probabilidad: 0.140,
      children: [
        { id: 'node-C', name: 'C', code: '0', codigo: '000', frecuencia: 160, probabilidad: 0.160 },
        { id: 'node-E', name: 'D', code: '1', codigo: '01', frecuencia: 280, probabilidad: 0.280 }
      ]
    }
  ]
};

export default huffmanTreeData;