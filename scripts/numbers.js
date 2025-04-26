const numbersModule = (function () {
    // neighbor map for the hexagons
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

    // Fisher-Yates shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // checking number neighbors
    function isValidNumberPlacement(hexId, number, currentNumbers, currentResources, options) {
        // if the hexagon is a desert
        if (currentResources[hexId] === 'desert') {
            return false;
        }

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

    // placing the numbers
    function placeNumbers(hexes, currentResources, options) {
        let availableNumbers = [...numbers];
        shuffleArray(availableNumbers);
        let currentNumbers = {};
    
        hexes.forEach((hex, index) => {
            const hexId = `t${index}`;
    
            // skipping desert
            if (currentResources[hexId] === 'desert') {
                currentNumbers[hexId] = '';
                hex.textContent = '';
                return;
            }
    
            let placed = false;
            let attempts = 0;
            const maxAttempts = 50;
    
            while (!placed && attempts < maxAttempts && availableNumbers.length > 0) {
                const number = availableNumbers[0];
                if (isValidNumberPlacement(hexId, number, currentNumbers, currentResources, options)) {
                    currentNumbers[hexId] = number;
                    hex.textContent = number;
                    availableNumbers.shift();
                    placed = true;
                } else {
                    availableNumbers.shift();
                    availableNumbers.push(number);
                    attempts++;
                }
            }
    
            // if we've reached maxattempts, we put a number anyway
            if (!placed && availableNumbers.length > 0) {
                const fallbackNumber = availableNumbers.shift();
                currentNumbers[hexId] = fallbackNumber;
                hex.textContent = fallbackNumber;
            }
        });
    
        return currentNumbers;
    }
    return {
        placeNumbers: placeNumbers
    };
})();