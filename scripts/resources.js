const resourcesModule = (function () {
    // Neighbor map for the hexagons
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

    const DESERT = 'desert';

    // Checking the neighbors (same resources can touch)
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

    // Placing the resource based on the picker
    function resourceSelection(hex, picker, res) {
        let resourcePath;

        switch (picker.selectedIndex) {
            case 0:
                resourcePath = 'original';
                break;
            case 1:
                resourcePath = 'irl';
                break;
            default:
                resourcePath = 'original';
                break;
        }

        hex.style.backgroundImage = `url(sources/${resourcePath}_resources/${res}.png)`;
    }

    // Fisher-Yates shuffling
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function placeResources(hexes, options, picker) {

        const terrainHexes = Array.from(hexes).filter(hex => hex.id && hex.id.startsWith('t'));

        const currentResources = {}; // Dictionary for the resources

        // Placing the Desert
        const desertIdx = Math.floor(Math.random() * terrainHexes.length);
        const desertHex = terrainHexes[desertIdx];
        currentResources[desertHex.id] = DESERT;
        resourceSelection(desertHex, picker, DESERT);

        // Resources
        const resourcePool = ['wood', 'wood', 'wood', 'wood', 'wheat', 'wheat', 'wheat', 'wheat',
            'sheep', 'sheep', 'sheep', 'sheep', 'brick', 'brick', 'brick', 'ore', 'ore', 'ore']

        shuffleArray(resourcePool);

        // Shuffling the terrainhexes, except the desert hex, and placing it in an array
        const shuffledHexes = shuffleArray([...terrainHexes.filter(hex => hex.id !== desertHex.id)]);

        // Placing resources
        for (const hex of shuffledHexes) {
            const hexId = hex.id;
            let placed = false;

            for (let i = 0; i < resourcePool.length; i++) {
                const resource = resourcePool[i];
                // Placing 1 resource
                if (isValidResourcePlacement(hexId, resource, currentResources, options)) {
                    currentResources[hexId] = resource;
                    resourceSelection(hex, picker, resource);
                    resourcePool.splice(i, 1);
                    placed = true;
                    break;
                }
            }

            // If there is still not placed hex, then delete the current ones, and restarting it
            if (!placed) {
                terrainHexes.forEach(h => {
                    if (h.id !== desertHex.id) {
                        h.style.backgroundImage = '';
                    }
                });
                return placeResources(hexes, options, picker);
            }
        }

        return currentResources;
    }

    // Changes the resources type based on the html select option named picker
    function changeOccuredOnPicker(hexes, currentResources, picker) {
        const terrainHexes = Array.from(hexes).filter(hex => hex.id && hex.id.startsWith('t'));

        terrainHexes.forEach(hex => {
            const hexId = hex.id;
            const resource = currentResources[hexId];
            if (resource) {
                resourceSelection(hex, picker, resource);
            }
        });
    }

    return {
        placeResources: placeResources,
        changeOccuredOnPicker: changeOccuredOnPicker
    };
})();