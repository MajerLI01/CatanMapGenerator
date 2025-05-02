document.addEventListener('DOMContentLoaded', function () {
    const options = {
        canSixEightTouch: document.getElementById('cb1'),
        canTwoTwelveTouch: document.getElementById('cb2'),
        canSameNumbersTouch: document.getElementById('cb3'),
        canSameResourcesTouch: document.getElementById('cb4')
    };

    const shuffleButton = document.getElementById('shuffleBtn');

    const hexes = document.querySelectorAll('.hex');

    function updateBoard() {
        const currentResources = resourcesModule.placeResources(hexes, options);
        numbersModule.placeNumbers(hexes, currentResources, options);
    }

    shuffleButton.addEventListener('click', updateBoard);

    updateBoard();
});