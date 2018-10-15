

export { CANVASES, sprites_TYPES, sprites_Imgs }

var CANVASES = {
  'dr01': {
    canvas: null,
    ctx: null,
    sprites: [],
    imgs: {
      'back': {
        src: 'assets/ill_01_back.png',
        data: null
      }  
    }
  },
  'dr02': {
    canvas: null,
    ctx: null,
    sprites: [],
    imgs: {
      'back': {
        src: 'assets/ill_02_back.png',
        data: null
      }
    }  
  },
  'dr03': {
    canvas: null,
    ctx: null,
    sprites: [],
    imgs: {
      'back': {
        src: 'assets/ill_03_back.png',
        data: null
      } 
    }
  },
  'dr04': {
    canvas: null,
    ctx: null,
    sprites: [],
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
  'dr05': {
    canvas: null,
    ctx: null,
    sprites: [],
    imgs: {
      'back': {
        src: 'assets/ill_05_back.png',
        data: null
      }
    }
  }
}
  
var sprites_TYPES = { 
  'LeftNORMslow': {
    conus: 1,
    spd: 0.6,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 80,
      yMax: 300,
    },
    finish: {
      xMin: 160,
      xMax: 280,
      yMin: 80,
      yMax: 300
    },
    color: '#ff0'
  },
  'LeftNORM': {
    conus: 1,
    spd: 1,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 80,
      yMax: 300,
    },
    finish: {
      xMin: 160,
      xMax: 280,
      yMin: 80,
      yMax: 300
    },
    color: '#ff0'
  },
  'RightBAD': {
    conus: 1,
    spd: 1,
    start: {
      xMin: 310,
      xMax: 320,
      yMin: 185,
      yMax: 187,
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 110,
      yMax: 230 
    },
    color: '#fff'
  },
  'LeftCONUS': {
    conus: 1,
    spd: 1,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 80,
      yMax: 300,
    },
    finish: {
      xMin: 160,
      xMax: 280,
      yMin: 150,
      yMax: 205
    },
    color: '#ff0'
  },  
  'LeftCONUSred': {
    conus: 1,
    spd: 1,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 80,
      yMax: 300,
    },
    finish: {
      xMin: 160,
      xMax: 280,
      yMin: 130,
      yMax: 235
    },
    color: '#f0f'
  },
  'LeftCONUSgreen': {
    conus: 1,
    spd: 1,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 80,
      yMax: 300,
    },
    finish: {
      xMin: 160,
      xMax: 280,
      yMin: 130,
      yMax: 235
    },
    color: '#0f0'
  }, 
  'RightCONUS': {
    conus: 1,
    spd: 1,
    start: {
      xMin: 320,
      xMax: 330,
      yMin: 150,
      yMax: 205
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 80,
      yMax: 300
    },
    color: '#ff0'
  }, 
  'RightCONUSred': {
    conus: 1,
    spd: 1, 
    start: {
      xMin: 320,
      xMax: 330,
      yMin: 130,
      yMax: 235
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 80,
      yMax: 300
    },
    color: '#f0f'
  },
  'RightCONUSgreen': {
    conus: 1,
    spd: 1,
    start: {
      xMin: 320,
      xMax: 330,
      yMin: 130,
      yMax: 235
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 80,
      yMax: 300
    },
    color: '#0f0'
  },
  'RightCONUSSuperSprT': {
    conus: 1,
    spd: 1,
    start: {
      xMin: 325,
      xMax: 330,
      yMin: 120,
      yMax: 170
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 80,
      yMax: 150
    },
    color: '#0ff'
  },
  'RightCONUSSuperSprB': {
    conus: 1,
    spd: 1,
    start: {
      xMin: 325,
      xMax: 330,
      yMin: 240,
      yMax: 270
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 220,
      yMax: 310
    },
    color: '#0ff'
  },
  'LeftCONUSSuperSprT': {
    conus: 1,
    spd: 1,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 80,
      yMax: 150,
    },
    finish: {
      xMin: 140,
      xMax: 160,
      yMin: 120,
      yMax: 170
    },
    color: '#0ff'
  },
  'LeftCONUSSuperSprB': {
    conus: 1,
    spd: 1,
    start: {
      xMin: -20,
      xMax: -10,
      yMin: 220,
      yMax: 310,
    },
    finish: {
      xMin: 140,
      xMax: 160,
      yMin: 240,
      yMax: 270
    },
    color: '#0ff'
  },
  'LinesVert': {
    conus: 0,
    spd: 0.2,
    start: {
      xMin: -200,
      xMax: -30,
      yMin: 0,
      yMax: 0,
    },
    finish: {
      xMin: 600,
      xMax: 600,
      yMin: 0,
      yMax: 0
    },
    color: 'lineVert'
  },
  'LinesHor': {
    conus: 0,
    spd: 0.1,
    start: {
      xMin: 0,
      xMax: 0,
      yMin: 800,
      yMax: 900,
    },
    finish: {
      xMin: 0,
      xMax: 0,
      yMin: -40,
      yMax: -60
    },
    color: 'lineHor'
  }    
}

const sprites_Imgs = {  
  'LinesHor': {
    src: 'assets/sprite_line_hor.png',
    data: null
  },
  'LinesVert': {
    src: 'assets/sprite_line_vert.png',
    data: null
  }
}  

