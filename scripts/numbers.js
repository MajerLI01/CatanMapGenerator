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

    // Fisher-Yates shuffling
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function placeNumbers(hexes, currentResources, options) {
        // Filter terrain hexes (t0-t18)
        const terrainHexes = Array.from(hexes).filter(hex => hex.id && hex.id.startsWith('t'));
        const currentNumbers = {};

        // Numbers
        const numberPool = [...numbers];
        shuffleArray(numberPool);

        // Randomize hexagons
        const shuffledHexes = shuffleArray([...terrainHexes]);

        // Plcaing numbers
        for (const hex of shuffledHexes) {
            const hexId = hex.id;
             // Skipping Desert
            if (currentResources[hexId] === 'desert') {
                currentNumbers[hexId] = '';
                const numberImg = hex.querySelector('.number-img');
                if (numberImg) {
                    numberImg.src = '';
                    numberImg.style.display = 'none';
                }
                continue;
            }

            // Placing the numbers
            let placed = false;
            for (let i = 0; i < numberPool.length; i++) {
                const number = numberPool[i];
                if (isValidNumberPlacement(hexId, number, currentNumbers, currentResources, options)) {
                    // Placing 1 number
                    currentNumbers[hexId] = number;
                    const numberImg = hex.querySelector('.number-img');
                    if (numberImg) {
                        numberImg.src = `sources/numbers/${number}.png`;
                        numberImg.style.display = 'block';
                    }
                    numberPool.splice(i, 1);
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                // Deleting the numbers and reallocating
                terrainHexes.forEach(h => {
                    const numImg = h.querySelector('.number-img');
                    if (numImg && currentResources[h.id] !== 'desert') {
                        numImg.src = '';
                        numImg.style.display = 'none';
                    }
                });
                return placeNumbers(hexes, currentResources, options);
            }
        }

        return currentNumbers;
    }

    return {
        placeNumbers: placeNumbers
    };
})();