document.addEventListener('DOMContentLoaded', function () {
    const options = {
        canSixEightTouch: document.getElementById('cb1'),
        canTwoTwelveTouch: document.getElementById('cb2'),
        canSameNumbersTouch: document.getElementById('cb3'),
        canSameResourcesTouch: document.getElementById('cb4'),
        canShuffleHarbors: document.getElementById('cb5'),
        canChangeHarborPositions: document.getElementById('cb6')
    };

    const shuffleButton = document.getElementById('shuffleBtn');

    const hexes = document.querySelectorAll('.hex');

    function updateBoard() {
        const currentResources = resourcesModule.placeResources(hexes, options);
        numbersModule.placeNumbers(hexes, currentResources, options);
        oceanModule.placeOceans(hexes, options);
    }

    shuffleButton.addEventListener('click', updateBoard);

    updateBoard();
});