const resourcesModule = (function () {
  // neihgbor map for the hexagons
  const neighbors = {
    't0': ['t1', 't3', 't4'],
    't1': ['t0', 't2', 't4', 't5'],
    't2': ['t1', 't5', 't6'],
    't3': ['t0', 't4', 't7', 't8'],
    't4': ['t0', 't1', 't3', 't5', 't8', 't9'],
    't5': ['t1', 't2', 't4', 't6', 't9', 't10'],
    't6': ['t2', 't5', 't10', 't11'],
    't7': ['t3', 't8', 't12'],
    't8': ['t3', 't4', 't7', 't9', 't12', 't13'],
    't9': ['t4', 't5', 't8', 't10', 't13', 't14'],
    't10': ['t5', 't6', 't9', 't11', 't14', 't15'],
    't11': ['t6', 't10', 't15'],
    't12': ['t7', 't8', 't13', 't16'],
    't13': ['t8', 't9', 't12', 't14', 't16', 't17'],
    't14': ['t9', 't10', 't13', 't15', 't17', 't18'],
    't15': ['t10', 't11', 't14', 't18'],
    't16': ['t12', 't13', 't17'],
    't17': ['t13', 't14', 't16', 't18'],
    't18': ['t14', 't15', 't17']
  };

  // Non-desert resources
  const resources = [
    'wood','wood','wood','wood',
    'wheat','wheat','wheat','wheat',
    'sheep','sheep','sheep','sheep',
    'brick','brick','brick',
    'ore','ore','ore'
  ];
  const DESERT = 'desert';

  // Fisher-Yates shuffling
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // checking the neighbors (same resources can touch)
  function isValidResourcePlacement(hexId, resource, currentResources, options) {
    if (!options.canSameResourcesTouch.checked) {
      for (let adjId of neighbors[hexId]) {
        if (currentResources[adjId] === resource) {
          return false;
        }
      }
    }
    return true;
  }

  function placeResources(hexes, options) {
    let success = false;
    let currentResources = {};

    while (!success) {
      currentResources = tryPlaceResources(hexes, options);
      success = true;
    }

    return currentResources;
  }

  function tryPlaceResources(hexes, options) {
    // Filter out ocean hexes (those with IDs starting with 'b')
    const terrainHexes = [];
    const oceanHexes = [];
    
    // Separate terrain hexes from ocean hexes
    for (let i = 0; i < hexes.length; i++) {
      const hex = hexes[i];
      if (hex.id && hex.id.startsWith('t')) {
        terrainHexes.push(hex);
      } else if (hex.id && hex.id.startsWith('b')) {
        oceanHexes.push(hex);
      }
    }
    
    // Make sure ocean hexes stay as ocean
    oceanHexes.forEach(hex => {
      hex.style.backgroundImage = '';
      hex.classList.add('hex-ocean');
    });
    
    const currentResources = {};
    let pool = shuffleArray([...resources]);
    
    // Choose random terrain hex for desert
    const desertIdx = Math.floor(Math.random() * terrainHexes.length);
    const desertHexId = terrainHexes[desertIdx].id;
    
    // Place desert
    currentResources[desertHexId] = DESERT;
    terrainHexes[desertIdx].style.backgroundImage = `url(sources/irl_resources/${DESERT}.png)`;
    
    // Place resources on remaining terrain hexes
    for (let i = 0; i < terrainHexes.length; i++) {
      const hex = terrainHexes[i];
      const hexId = hex.id;
      
      // Skip the desert hex
      if (hexId === desertHexId) continue;
      
      let placed = false;
      for (let j = 0; j < pool.length; j++) {
        const r = pool[j];
        if (isValidResourcePlacement(hexId, r, currentResources, options)) {
          currentResources[hexId] = r;
          hex.style.backgroundImage = `url(sources/irl_resources/${r}.png)`;
          pool.splice(j, 1);
          placed = true;
          break;
        }
      }
      
      // If we couldn't place a valid resource, use the first one in the pool
      if (!placed && pool.length > 0) {
        const r = pool.shift();
        currentResources[hexId] = r;
        hex.style.backgroundImage = `url(sources/irl_resources/${r}.png)`;
      }
    }

    return currentResources;
  }

  return {
    placeResources: placeResources
  };
})();