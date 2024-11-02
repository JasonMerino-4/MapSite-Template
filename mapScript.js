const nodeManagement = {
    nodeMap: new Map(),
    focusedRoom: null,
    focusedID: null, //Too keep track of ids in instances of roomnumbers paired to more than one node
};

//Each building needs an array setup with every index matching the floor number
//Floorplan images have to be placeed within a folder named as the map key, place this building folder within /Floorplans or it won't work.
//Floorplan images need to named in this format "Floor #.png", ex "Floor 1.png"
function createmapDatabase() {
    const Database = new Map();
    Database.set('Example Building', new Array(3)); // if even the building doesn't have a basement include it since arrays start at index 0 and you want the index to match the floor
    Database.get('Example Building')[1] = "900 675 101 48 30 0 441 126 rectangle 0 103 48 30 0 585 126 rectangle 0 105 48 30 0 732 126 rectangle 0 100 42 30 0 444 255 rectangle 0 102 48 30 0 585 255 rectangle 0 104 48 30 0 729 255 rectangle 0";
    Database.get('Example Building')[2] = "950 712 200 51 32 0 235 136 rectangle 0 202 51 32 0 389 137 rectangle 0 204 51 32 0 542 136 rectangle 0 201 44 32 0 398 271 rectangle 0 203 51 32 0 549 273 rectangle 0 205 51 32 0 738 203 rectangle 0";

    return Database;
}

const mapDatabase = createmapDatabase();

//factory function to output node object
function createNode(roomNumber, id, nodeShape) {
    const newElement = document.createElement('div');
    newElement.classList.add('node');

    if (nodeShape != 'rectangle') {
        newElement.classList.add(nodeShape);
    }

    newElement.addEventListener('click', function (event) {
        nodeManagement.focusedRoom = roomNumber;
        nodeManagement.focusedID = id;
    })

    return {
        element: newElement,
        roomNumber: roomNumber,
        rotation: 0,
        width: 32,
        height: 32,
        xPosition: 0,
        yPosition: 0,
        shape: nodeShape,
        id: id //for instances where a roomnumber is paired to more than one node, will be set later
    }
}


//Manager function for controlling node storing/placement
function requestNode(roomNumber, shape) {
    let newNode;

    if (roomNumber != '') {
        if (nodeManagement.nodeMap.has(roomNumber)) {
            const id = nodeManagement.nodeMap.get(roomNumber).length;
            newNode = createNode(roomNumber, id, shape);

            nodeManagement.nodeMap.get(roomNumber).push(newNode);
            nodeManagement.focusedID = id;
        } else {
            newNode = createNode(roomNumber, 0, shape);
            const nodeArray = new Array(newNode);
            nodeManagement.nodeMap.set(roomNumber, nodeArray);
            nodeManagement.focusedID = 0;
        }

        return newNode;
    } else {
        alert("invalid roomnumber");
        return null;
    }
}

function scaleNodes(originalImgWidth, originalImgHeight) {
    if ((originalImgWidth !== 0) && (originalImgHeight !== 0)) {
        const newImgWidth = parseInt(window.getComputedStyle(document.getElementById('floorplan')).width);
        const newImgHeight = parseInt(window.getComputedStyle(document.getElementById('floorplan')).height);
        const widthRatio = newImgWidth / originalImgWidth;
        const heightRatio = newImgHeight / originalImgHeight;

        //multiply node dimensions by ratios
        nodeManagement.nodeMap.forEach((value, key) => {
            value.forEach((node) => {
                //NodeManagement update
                node.width = Math.round((node.width) * widthRatio);
                node.height = Math.round((node.height) * heightRatio);
                node.xPosition = Math.round((node.xPosition) * widthRatio);
                node.yPosition = Math.round((node.yPosition) * heightRatio);
                //css changes
                node.element.style.width = node.width + 'px';
                node.element.style.height = node.height + 'px';
                node.element.style.left = node.xPosition + 'px';
                node.element.style.top = node.yPosition + 'px';
            })
        })
    }
}

function deleteNodes() {
    nodeManagement.nodeMap.forEach((nodeArray) => {
        nodeArray.forEach((node)=>{
            node.element.remove();
        })
    })

    nodeManagement.nodeMap.clear();
}

function loadElement(roomNumber, buildingName, floor) {
    deleteNodes();

    if ((roomNumber === '') || (buildingName === '') || (floor === NaN) || (floor > mapDatabase.get(buildingName).length)) {
        return;
    }

    const dataCollection = mapDatabase.get(buildingName)[floor].split(/\s+/);

    for (let i = 2; i < dataCollection.length - 1; i = i + 8) {
        if (dataCollection[i] === roomNumber) {
            let Node = requestNode(dataCollection[i], dataCollection[i + 6]);

            if (Node != null) {
                //NodeManagement Update
                Node.width = dataCollection[i + 1];
                Node.height = dataCollection[i + 2];
                Node.rotation = dataCollection[i + 3];
                Node.xPosition = dataCollection[i + 4];
                Node.yPosition = dataCollection[i + 5];
                Node.shape = dataCollection[i + 6];
                Node.id = dataCollection[i + 7];

                //CSS Changes
                Node.element.style.width = parseInt(dataCollection[i + 1]) + 'px';
                Node.element.style.height = parseInt(dataCollection[i + 2]) + 'px';
                Node.element.style.transform = `rotate(${dataCollection[i + 3]}deg)`;
                Node.element.style.left = parseInt(dataCollection[i + 4]) + 'px';
                Node.element.top = parseInt(dataCollection[i + 5]) + 'px';

                document.getElementById('floorplan-wrapper').appendChild(Node.element);
            } 
        }
    }

    scaleNodes(parseInt(dataCollection[0]), parseInt(dataCollection[1]));
}

function autofillDataList(buildingName) {

    if (!mapDatabase.has(buildingName)) {
        return;
    }

    const roomList = document.getElementById('roomlist');
    const addedRooms = new Map();

    mapDatabase.get(buildingName).forEach((floorData) => {
        const dataCollection = floorData.split(/\s+/);
        for (let i = 2; i < dataCollection.length - 1; i = i + 8) {
            if (!addedRooms.has(dataCollection[i])) {
                addedRooms.set(dataCollection[i], true);
                const newOption = document.createElement('option');
                newOption.value = dataCollection[i];
                roomList.appendChild(newOption);
            }
        }
    })
}

function resetDataList() {
    const datalist = document.getElementById('roomlist');

    while (datalist.firstChild) {
        datalist.removeChild(datalist.lastChild);
    }
}