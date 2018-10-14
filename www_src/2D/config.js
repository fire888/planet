

export { CANVASES, sprites_TYPES }

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
    color: {
      r: '255',
      g: '255',
      b: '0',
      opasity: 1.0
    }
  },
  'RightBAD': {
    conus: 1,
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
    color: {
      r: '255',
      g: '255',
      b: '255',
      opasity: 0.5
    }
  },
  'LeftCONUS': {
    conus: 1,
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
    color: {
      r: '255',
      g: '255',
      b: '0',
      opasity: 1.0
    }
  },  
  'LeftCONUSred': {
    conus: 1,
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
    color: {
      r: '255',
      g: '0',
      b: '0',
      opasity: 1.0
    }
  },
  'LeftCONUSgreen': {
    conus: 1,
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
    color: {
      r: '0',
      g: '255',
      b: '0',
      opasity: 1.0
    }
  }, 
  'RightCONUS': {
    conus: 1,
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
    color: {
      r: '255',
      g: '255',
      b: '0',
      opasity: 1.0
    }
  }, 
  'RightCONUSred': {
    conus: 1,
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
    color: {
      r: '255',
      g: '0',
      b: '0',
      opasity: 1.0
    }
  },
  'RightCONUSgreen': {
    conus: 1,
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
    color: {
      r: '0',
      g: '255',
      b: '0',
      opasity: 1.0
    }
  },
  'RightCONUSSuperSpr': {
    conus: 1,
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
    color: {
      r: '0',
      g: '255',
      b: '255',
      opasity: 1.0
    }
  },
  'LeftCONUSSuperSpr': {
    conus: 1,
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
    color: {
      r: '0',
      g: '255',
      b: '255',
      opasity: 1.0
    }  
  },
  'TopCONUSSuperSpr': {
    conus: 1,
    start: {
      xMin: 300,
      xMax: 400,
      yMin: 200,
      yMax: 300,
    },
    finish: {
      xMin: 600,
      xMax: 600,
      yMin: 0,
      yMax: 600
    },
    color: {
      r: '0',
      g: '255',
      b: '255',
    opasity: 0.3
    }
  }    
}

