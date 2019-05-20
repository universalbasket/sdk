var config = {
    name: 'aboutYourPet',
    title: 'Tell Me About Your Pet',
    inputs: [
        { key: 'pets', inputMethod: null, sourceOutputKey: null },
        { key: 'selectedBreedType', inputMethod: "SelectOne", sourceOutputKey: 'availableBreedTypes', title: 'select breed type' }
    ],
};

console.log(ubioApp);
var section = ubioApp.createSection(config, '#app', () => { console.log('finished!')});

section.init();
