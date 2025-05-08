const oceanModule = (function () {
    const harbors = ['any', 'any', 'any', 'any', 'sheep', 'brick', 'ore', 'wheat', 'wood'];
    let shuffledHarbors = [...harbors];


    //Fisher-Yates shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Placing Ocean/Harbor hexes
    function oneOrTwoSided(hex, harborOrBeach) {
        if (
            hex.id === 'b0' || hex.id === 'b3' || hex.id === 'b6' ||
            hex.id === 'b9' || hex.id === 'b12' || hex.id === 'b15'
        ) {
            hex.style.backgroundImage = `url(sources/ocean/1_sided_${harborOrBeach}.png)`; // 1-sides kikötő
        } else {
            hex.style.backgroundImage = `url(sources/ocean/2_sided_${harborOrBeach}.png)`; // 2-sides kikötő
        }
    }

    function placeOceans(hexes, options) {

        //Only the oceanhexes
        const oceanHexes = Array.from(hexes).filter(h => h.id.startsWith('b'));

        //Sorting the ocean hexes
        oceanHexes.sort((h1, h2) => {
            const id1 = parseInt(h1.id.replace('b', ''));
            const id2 = parseInt(h2.id.replace('b', ''));
            return id1 - id2;
        });

        //Shuffle Harbors option
        if (options.canShuffleHarbors.checked) {
            shuffledHarbors = shuffleArray(harbors);
        }

        let currentHarbors = [...shuffledHarbors];

        //Change Harnor Positions option
        const startIdx = options.canChangeHarborPositions.checked ? 1 : 0;

        // Base ocean hexes allocation
        oceanHexes.forEach(hex => {
            oneOrTwoSided(hex, 'beach')
        });

        // placing the harbors by goin clockwise
        for (let i = startIdx; i < oceanHexes.length && currentHarbors.length > 0; i += 2) {
            const hex = oceanHexes[i];
            oneOrTwoSided(hex, currentHarbors[0])
            currentHarbors.shift();
        }
    }

    return {
        placeOceans: placeOceans
    };
})();