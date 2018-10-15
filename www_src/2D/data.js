

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
      },
      'wire': {
        src: 'assets/ill_01_img.png',
        data: null,
        x: 30,
        y: 0
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
      },
      'wire': {
        src: 'assets/ill_02_wire.png',
        data: null,
        x: 120,
        y: 150 
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
      },
      'wire': {
        src: 'assets/ill_03_wire.png',
        data: null,
        x: 80,
        y: 70 
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
        x: 80,
        y: 70 
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
      },
      'wire': {
        src: 'assets/ill_05_wire.png',
        data: null,
        x: 0,
        y: 65
      }
    }
  }
}
  
var sprites_TYPES = { 
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
    color: 'yellow'
  },
  'RightBAD': {
    conus: 1,
    spd: 1,
    start: {
      xMin: 310,
      xMax: 320,
      yMin: 180,
      yMax: 183,
    },
    finish: {
      xMin: 500,
      xMax: 510,
      yMin: 110,
      yMax: 230 
    },
    color: 'white'
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
    color: 'yellow'
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
      yMin: 150,
      yMax: 205
    },
    color: 'red'
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
      yMin: 150,
      yMax: 205
    },
    color: 'green'
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
    color: 'yellow'
  }, 
  'RightCONUSred': {
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
    color: 'red'
  },
  'RightCONUSgreen': {
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
    color: 'green'
  },
  'RightCONUSSuperSpr': {
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
    color: 'super'
  },
  'LeftCONUSSuperSpr': {
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
    color: 'super'
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
  'white': {
    src: 'assets/sprite_white.png',
    data: null
  }, 
  'yellow': {
    src: 'assets/sprite_yellow.png',
    data: null
  },
  'green': {
    src: 'assets/sprite_green.png',
    data: null
  },
  'red': {
    src: 'assets/sprite_red.png',
    data: null
  },   
  'super': {
    src: 'assets/sprite_super.png',
    data: null
  },   
  'lineHor': {
    src: 'assets/sprite_line_hor.png',
    data: null
  },
  'lineVert': {
    src: 'assets/sprite_line_vert.png',
    data: null
  }
}  

