function addReflectionToDivs() {
    const reflectDivs = document.querySelectorAll('.reflect');

    reflectDivs.forEach(div => {

        const reflectionDiv = div.cloneNode(true); 
        reflectionDiv.classList.add('reflection'); 

        const gapHeight = div.getAttribute('data-reflect-gap') || 2; 
        reflectionDiv.style.marginTop = `${gapHeight}vh`; 

        reflectionDiv.style.transform = 'scaleY(-1) translate(-50%, -50%)'; 

        reflectionDiv.style.filter = 'url(#turbulence)';

        div.parentNode.insertBefore(reflectionDiv, div.nextSibling);
    });
}

// Call the function to create reflections with individual gaps
addReflectionToDivs();

document.addEventListener("mousemove", function(event) {
    const layer = document.querySelector(".layer");
    const layerRect = layer.getBoundingClientRect();

    // Get all child elements with a layer-effect attribute
    const elements = layer.querySelectorAll("[layer-effect]");

    elements.forEach(element => {
        const layerEffect = parseFloat(element.getAttribute('layer-effect')); // Get layer-effect value
    
        // Assuming the mouse event object is provided
        document.addEventListener('mousemove', event => {
            const layerRect = element.getBoundingClientRect(); // Get the element's position
            const mouseX = event.clientX - layerRect.left; // Mouse X position relative to the layer
            const mouseY = event.clientY - layerRect.top;  // Mouse Y position relative to the layer
    
            // Calculate the new position using vh units
            const vhOffsetX = (mouseX / window.innerWidth) * 100 * layerEffect; // Convert to vh
            const vhOffsetY = (mouseY / window.innerHeight) * 100 * layerEffect; // Convert to vh
    
            // Get the current transform value
            const currentTransform = window.getComputedStyle(element).transform;
    
            // Determine if the element is flipped based on its transform
            const isFlipped = 
                /matrix\s*\(\s*-1\s*,/.test(currentTransform) || 
                /scaleY\s*\(\s*-1\s*\)/.test(currentTransform) || 
                /matrix\s*\(\s*[\d\.\-]*,\s*[\d\.\-]*,\s*[\d\.\-]*,\s*-1\s*,/.test(currentTransform);
    
            // Check if the element has the classes .background or .water
            const hasBackgroundOrWaterClass = element.classList.contains('background') || element.classList.contains('water');
    
            // Move the object with layer effect, preserving flip state, and excluding background/water elements
            if (isFlipped && !hasBackgroundOrWaterClass) {
                element.style.transform = `translate(${vhOffsetX}vh, ${vhOffsetY}vh) scaleY(-1) translate(-50%, -50%)`;
            } else if (!hasBackgroundOrWaterClass) {
                element.style.transform = `translate(${vhOffsetX}vh, ${vhOffsetY}vh) translate(-50%, -50%)`;
            } else {
                element.style.transform = `translate(${vhOffsetX}vh, ${vhOffsetY}vh)`;
            }
        });
    });
});

function changeImagesByParameter(timeOfDay) {
    const elementsToChange = document.querySelectorAll('.people, .bird, .background, .water'); // Select elements

    // Define different sets of images for different elements
    const imageSets = {
        people: [
            'people-airemove-dawn.png',  // Index 0: Dawn
            'people-airemove-day.png',   // Index 1: Day
            'people-airemove-dusk.png',  // Index 2: Dusk
            'people-airemove-night.png'  // Index 3: Night
        ],
        bird: [
            'bird-airemove-dawn.png',
            'bird-airemove-day.png',
            'bird-airemove-dusk.png',
            'bird-airemove-night.png'
        ],
        background: [
            'Milthm-dawn-airemove.jpg',
            'Milthm-day-airemove.jpg',
            'Milthm-dusk-airemove.png',
            'Milthm-night-airemove.jpg'
        ],
        water: [
            'Milthm-dawn-airemove-ripper.png',
            'Milthm-day-airemove-ripper.png',
            'Milthm-dusk-airemove-ripper.png',
            'Milthm-night-airemove-ripper.png'
        ]
    };

    // Define different scales for the .people element based on the current image
    const peopleScales = [
        { width: '75vh', height: '80vh', top: '50vh', left: '50vw' },  // Dawn
        { width: '60vh', height: '80vh', top: '50vh', left: '50vw' },  // Day
        { width: '55vh', height: '80vh', top: '50vh', left: '50vw' },// Dusk
        { width: '50vh', height: '80vh', top: '50vh', left: '50vw' } // Night
    ];

    // Map timeOfDay to an index
    const timeMapping = { dawn: 0, day: 1, dusk: 2, night: 3 };
    const index = timeMapping[timeOfDay]; // Get the index for the timeOfDay

    if (index === undefined) {
        console.error("Invalid timeOfDay parameter. Use 'dawn', 'day', 'dusk', or 'night'.");
        return;
    }

    elementsToChange.forEach(element => {
        const classList = element.classList;

        // Determine the correct image set based on the class of the element
        let images;
        if (classList.contains('people')) {
            images = imageSets.people;
        } else if (classList.contains('bird')) {
            images = imageSets.bird;
        }

        if (classList.contains('background')) {
            const backgroundLayers = document.querySelectorAll('.background-layer'); // Select both background layers

            // Fade out the active layer
            const activeLayer = backgroundLayers[0].style.opacity === '1' ? backgroundLayers[0] : backgroundLayers[1];
            const inactiveLayer = activeLayer === backgroundLayers[0] ? backgroundLayers[1] : backgroundLayers[0];

            inactiveLayer.style.backgroundImage = `url(${imageSets.background[index]})`; // Change inactive layer's image
            inactiveLayer.style.transition = 'opacity 1s ease-in-out';
            activeLayer.style.opacity = 0;
            inactiveLayer.style.opacity = 1; // Fade in the new layer after switching

        } else if (classList.contains('water')) {
            const waterLayers = document.querySelectorAll('.water-layer'); // Select both water layers

            // Fade out the active layer
            const activeLayer = waterLayers[0].style.opacity === '1' ? waterLayers[0] : waterLayers[1];
            const inactiveLayer = activeLayer === waterLayers[0] ? waterLayers[1] : waterLayers[0];

            inactiveLayer.style.backgroundImage = `url(${imageSets.water[index]})`; // Change inactive layer's image
            inactiveLayer.style.transition = 'opacity 1s ease-in-out';
            activeLayer.style.opacity = 0;
            inactiveLayer.style.opacity = 1; 

        } else if (images) {
            // Fade out the element for people and birds using opacity
            element.style.transition = 'opacity 1s ease-in-out';
            element.style.opacity = 0;

            setTimeout(() => {
                // Update the image for people and birds
                element.style.backgroundImage = `url(${images[index]})`;

                // Apply new scale settings (only for .people)
                if (classList.contains('people')) {
                    const scale = peopleScales[index];
                    element.style.width = scale.width;
                    element.style.height = scale.height;
                    element.style.top = scale.top;
                    element.style.left = scale.left;
                }

                // Fade in
                element.style.opacity = 1;
            }, 1000); // Ensure the timing matches the transition duration
        }
    });
}




changeImagesByParameter("dawn");
const timePeriods = ['dawn', 'day', 'dusk', 'night'];
function cycleThroughTimes(index) {
    if (index >= timePeriods.length) index = 0; 
    
    changeImagesByParameter(timePeriods[index]);

    setTimeout(() => {
        cycleThroughTimes(index + 1); 
    }, 3000);
}
cycleThroughTimes(0);