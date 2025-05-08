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
    function resourceSelection(hex, picker, res){
        if(picker.selectedIndex == 0){
            hex.style.backgroundImage = `url(sources/original_resources/${res}.png)`;
        } else if(picker.selectedIndex == 1){
            hex.style.backgroundImage = `url(sources/irl_resources/${res}.png)`;
        }
    }   

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

    // Backtracking algorithm to place resources
    function placeResources(hexes, options, picker) {
        // Filter out ocean hexes (those with IDs starting with 'b')
        const terrainHexes = Array.from(hexes).filter(hex => hex.id && hex.id.startsWith('t'));

        const currentResources = {};

        // Choose random terrain hex for desert
        const desertIdx = Math.floor(Math.random() * terrainHexes.length);
        const desertHex = terrainHexes[desertIdx];
        const desertHexId = desertHex.id;

        // Place desert
        currentResources[desertHexId] = DESERT;
        resourceSelection(desertHex, picker, DESERT);

        // Initialize available resources count
        const availableResources = {
            wood: 4,
            wheat: 4,
            sheep: 4,
            brick: 3,
            ore: 3
        };

        // Backtracking function
        function backtrack(index) {
            if (index >= terrainHexes.length) {
                return true; // All hexes assigned
            }

            const hex = terrainHexes[index];
            const hexId = hex.id;

            // Skip desert
            if (hexId === desertHexId) {
                return backtrack(index + 1);
            }

            // Try each resource type
            const resourceTypes = Object.keys(availableResources);
            for (const resource of resourceTypes) {
                if (availableResources[resource] > 0 && isValidResourcePlacement(hexId, resource, currentResources, options)) {
                    // Place resource
                    currentResources[hexId] = resource;
                    resourceSelection(hex, picker, resource);
                    availableResources[resource]--;

                    // Recurse to next hex
                    if (backtrack(index + 1)) {
                        return true;
                    }

                    // Backtrack: remove resource and restore count
                    delete currentResources[hexId];
                    hex.style.backgroundImage = '';
                    availableResources[resource]++;
                }
            }

            return false; // No valid placement found
        }

        // Start backtracking from index 0
        const success = backtrack(0);

        if (success) {
            return currentResources;
        }
    }

    return {
        placeResources: placeResources,
        changeOccuredOnPicker: changeOccuredOnPicker
    };
})();