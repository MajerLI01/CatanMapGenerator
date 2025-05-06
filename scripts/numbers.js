const numbersModule = (function () {
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

    // Catan numbers
    const numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

    // Checking number neighbors
    function isValidNumberPlacement(hexId, number, currentNumbers, currentResources, options) {
        // If the hexagon is a desert
        if (currentResources[hexId] === 'desert') return false;

        const adjacentHexes = neighbors[hexId];
        for (let adjId of adjacentHexes) {
            const adjNumber = currentNumbers[adjId];
            if (adjNumber === undefined || adjNumber === '') continue;

            // 6 & 8 can touch
            if (!options.canSixEightTouch.checked) {
                if ((number === 6 && adjNumber === 8) || (number === 8 && adjNumber === 6)) {
                    return false;
                }
            }

            // 2 & 12 can touch
            if (!options.canTwoTwelveTouch.checked) {
                if ((number === 2 && adjNumber === 12) || (number === 12 && adjNumber === 2)) {
                    return false;
                }
            }

            // Same numbers can touch
            if (!options.canSameNumbersTouch.checked) {
                if (number === adjNumber) {
                    return false;
                }
            }
        }
        return true;
    }

    // Placing the numbers using backtracking
    function placeNumbers(hexes, currentResources, options) {
        // Filter terrain hexes (t0-t18)
        const terrainHexes = Array.from(hexes).filter(hex => hex.id && hex.id.startsWith('t'));
        const currentNumbers = {};

        // Initialize available numbers count
        const availableNumbers = {};
        numbers.forEach(num => {
            availableNumbers[num] = (availableNumbers[num] || 0) + 1;
        });

        // Backtracking function
        function backtrack(index) {
            if (index >= terrainHexes.length) {
                return true; // All hexes assigned
            }

            const hex = terrainHexes[index];
            const hexId = hex.id;
            const numberImg = hex.querySelector('.number-img');

            // Skip desert
            if (currentResources[hexId] === 'desert') {
                currentNumbers[hexId] = '';
                if (numberImg) numberImg.src = '';
                return backtrack(index + 1);
            }

            // Try each number
            for (const number in availableNumbers) {
                if (availableNumbers[number] > 0 && isValidNumberPlacement(hexId, Number(number), currentNumbers, currentResources, options)) {
                    // Place number
                    currentNumbers[hexId] = Number(number);
                    if (numberImg) numberImg.src = `sources/numbers/${number}.png`;
                    availableNumbers[number]--;

                    // Recurse to next hex
                    if (backtrack(index + 1)) {
                        return true;
                    }

                    // Backtrack: remove number and restore count
                    delete currentNumbers[hexId];
                    if (numberImg) numberImg.src = '';
                    availableNumbers[number]++;
                }
            }

            return false; // No valid placement found
        }

        // Start backtracking from index 0
        const success = backtrack(0);

        if (success) {
            return currentNumbers;
        }
    }

    return {
        placeNumbers: placeNumbers
    };
})();