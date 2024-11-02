document.addEventListener('DOMContentLoaded', function(){

    const buildingInput = document.getElementById('building-input');

    buildingInput.addEventListener('blur', function(event){
        if (buildingInput.value !=  ''){
            autofillDataList(buildingInput.value);
        }
    })

    const roomNumberInput = this.getElementById('roomnumber-input');
    roomNumberInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const floor = (parseInt((roomNumberInput.value).charAt(0)));
            if (buildingInput.value !== '') {
                if (floor < mapDatabase.get(buildingInput.value).length) {
                    const floorplan = document.getElementById('floorplan');
                    floorplan.src = `Floorplans\\${buildingInput.value}\\Floor ${floor}.png`
                    floorplan.onload = function(){ loadElement(roomNumberInput.value, buildingInput.value, floor)}
                }
            }
        }
    });

    //modify this to change the logic for which numbers are on what floor, 
    roomNumberInput.addEventListener('input', function(event){
        if (roomNumberInput !== '') {
            const floor = (parseInt((roomNumberInput.value).charAt(0))); //currently just checks the first char to check what floor, so this will correctly work for buildings dividing by 100 rooms per floor or 1000 rooms per floor
            if (buildingInput.value !== '') {
                if (floor < mapDatabase.get(buildingInput.value).length) {
                    const floorplan = document.getElementById('floorplan');
                    floorplan.src = `Floorplans\\${buildingInput.value}\\Floor ${floor}.png`
                    floorplan.onload = function () { loadElement(roomNumberInput.value, buildingInput.value, floor) }
                }
            }
        }
    })

    window.addEventListener('resize', function(){
        if (roomNumberInput !== '') {
            const floor = (parseInt((roomNumberInput.value).charAt(0)));
            if (buildingInput.value !== '') {
                document.getElementById('floorplan').src = `Floorplans\\${buildingInput.value}\\Floor ${floor}.png`
                loadElement(roomNumberInput.value, buildingInput.value, floor);
            }
        }
    })

    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('input', function(){
        let hexColor = colorPicker.value.substring(1); // Remove #
        let r = parseInt(hexColor.substring(0, 2), 16);
        let g = parseInt(hexColor.substring(2, 4), 16);
        let b = parseInt(hexColor.substring(4, 6), 16);

        // Calculate the inverted RGB values
        let invertedR = 255 - r;
        let invertedG = 255 - g;
        let invertedB = 255 - b;

        // Create the inverted color in hex format
        let invertedHex = "#" + 
            ("0" + invertedR.toString(16)).slice(-2) +
            ("0" + invertedG.toString(16)).slice(-2) +
            ("0" + invertedB.toString(16)).slice(-2);
        
        nodeManagement.nodeMap.forEach((nodeArray, roomnumber)=>{
            nodeArray.forEach((node=>{
                node.element.element.style.backgroundColor = invertedHex;
            }))
        })
    })


});