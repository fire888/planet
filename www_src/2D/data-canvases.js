


export { CANVASES }

var CANVASES = {
  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
  'canvas-dr01': {
    canvas: null,
    ctx: null,
    sprites_types: [
      { type: 'LinesVert', count: 5 },
      { type: 'LinesHor', count: 2 }
    ],
    sprites: [],
    imgs: {
      'back': {
        src: 'assets/ill_01_back.png',
        data: null
      }  
    }
  },
  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
  'canvas-dr02': {
    canvas: null,
    ctx: null,
    sprites_types: [
      { type: 'LeftYellowSlow', count: 70 },
      { type: 'RightWhite', count: 10 }
    ],
    sprites: [],
    imgs: {
      'back': {
        src: 'assets/ill_02_back.png',
        data: null
      }
    }  
  },
  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
  'canvas-dr03': {
    canvas: null,
    ctx: null,
    sprites_types: [
      { type: 'LeftYellow', count: 70 },
      { type: 'RightYellow', count: 70 }
    ],
    sprites: [],
    imgs: {
      'back': {
        src: 'assets/ill_03_back.png',
        data: null
      } 
    }
  },
  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
  'canvas-dr04': {
    canvas: null,
    ctx: null,
    sprites: [],
    sprites_types: [
      { type: 'LeftYellow', count: 50 },
      { type: 'LeftMagenta', count: 50 },
      { type: 'LeftGreen', count: 50 },
      { type: 'RightYellow', count: 50 },
      { type: 'RightMagenta', count: 50 },
      { type: 'RightGreen', count: 50 }
    ],    
    imgs: {
      'back': {
        src: 'assets/ill_04_back.png',
        data: null
      },
      'wire': {
        src: 'assets/ill_04_wire.png',
        data: null,
        x: 0,
        y: 0,
        x2: 500,
        y2: 400 
      }     
    }
  },
  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/ 
  'canvas-dr05': {
    canvas: null,
    ctx: null,
    sprites: [],
    sprites_types: [
      { type: 'LeftSuperTop', count: 70 },
      { type: 'LeftSuperBottom', count: 50 },
      { type: 'RightSuperTop', count: 50 },
      { type: 'RightSuperBottom', count: 50 }
    ],  
    imgs: {
      'back': {
        src: 'assets/ill_05_back.png',
        data: null
      }
    }
  }
}
  

