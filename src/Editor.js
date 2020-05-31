import React from 'react'
// import {v4 as uuid} from 'uuid'
import getId from "./getId"
import {VERTEX_SHAPE, VERTEX_RADIUS, URL, URL2, REQUEST_OPTIONS} from './constants'
import copyObj from "./copyObj";


export default class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDirected: false,
            paintingColor: '',
            paintMode: false
        };
        this.canvas = React.createRef();
        this.showVertexIds = true;
        this.isPainting = false;
        this.isDragging = false;
        this.draggingOffset = {};
        this.selectedVertex = null;
        this.clickTimer = null;
        // this.props.graphs = this.props.graphs;
        this.vertexes = this.props.graphs.find(graph => graph.id === this.props.graphId).vertexes;
        this.arcs = this.props.graphs.find(graph => graph.id === this.props.graphId).arcs;
    }
    prepareGraph(graph) {
        if(!graph) throw new Error(`graph array is not array: ${graph}`);

        for (let vertex of graph.vertexes) {
            vertex.arcs = [];
            for (let arc of graph.arcs) {
                if (arc.vertex1.id === vertex.id && arc.vertex2.id === vertex.id) {
                    vertex.arcs.push(arc.id);
                    vertex.arcs.push(arc.id);
                } else if ((arc.vertex1.id === vertex.id || arc.vertex2.id === vertex.id)) {
                    vertex.arcs.push(arc.id);
                }
            }
        }
        return graph;
    }
    updateGraphRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId, {
            method: 'PUT',
            body: JSON.stringify(this.props.graphs.find(graph => graph.id === this.props.graphId)),
            ...REQUEST_OPTIONS
        })
            .catch(err => console.log(err))
    }

    adjacencyMatrixRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId + '/adjacencyMatrix', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                alert(data.matrix.trim())
            }).catch(err => console.log(err));
    }
    incidenceMatrixRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId + '/incidenceMatrix', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                alert(data.matrix.trim())
            }).catch(err => console.log(err));
    }
    eulerianCycleRequest(){
        let startNode = this.vertexes.filter(v => v.selected)[0] || this.vertexes[0];
        fetch(`${URL}/api/v1/graph/${this.props.graphId}/eulerianCycle?startNode=${startNode.id}`, {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> eulerianCycle request: ', data);
                alert(data.path.map(vertex => vertex.id).join(','))
            }).catch(err => console.log(err));
    }
    hamiltonianPathRequest(){
        let startNode = this.vertexes.filter(v => v.selected)[0] || this.vertexes[0];
        fetch(`${URL}/api/v1/graph/${this.props.graphId}/hamiltonianPath?startNode=${startNode.id}`, {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> hamiltonianPath request: ', data);
                alert(data.path.map(vertex => vertex.id).join(','))
            }).catch(err => console.log(err));
    }
    findDiameterRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId + '/diameter', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> diameter request: ', data);
                alert(data.diameter)
            }).catch(err => console.log(err));
    }
    findRadiusRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId + '/radius', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> Radius request: ', data);
                alert(data.radius)
            }).catch(err => console.log(err));
    }
    findCenterRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId + '/center', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> Center request: ', data);
                alert(data.center.map(vertex => vertex.id).join(','))
            }).catch(err => console.log(err));
    }
    planarCheckRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId + '/planarCheck', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> planarCheck request: ', data);
                data.isPlanar ? alert('Graph is planar') : alert('Graph is not planar');
            }).catch(err => console.log(err));
    }
    planarReductionRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId + '/planarReduction', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> planarReduction request: ', data);
                this.props.setGraph(this.prepareGraph(data.planarGraph));
                this.updateGraphRequest();
            }).catch(err => console.log(err));
    }
    isTreeRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId + '/isTree', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> isTree request: ', data);
                data.isTree ? alert('Graph is tree') : alert('Graph is not tree');
            }).catch(err => console.log(err));
    }
    treeReductionRequest(){
        fetch(URL + '/api/v1/graph/' + this.props.graphId + '/treeReduction', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> planarReduction request: ', data);
                this.props.setGraph(this.prepareGraph(data.planarGraph));
                this.updateGraphRequest();
            }).catch(err => console.log(err));
    }
    isFullRequest(){
        fetch(URL2 + '/api/nodejs/checkFull/', {
            method: 'POST',
            body: JSON.stringify(this.props.graphs.find(g => g.id === this.props.graphId)),
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                data ? alert('Graph is full') : alert('Graph is not full');
            }).catch(err => console.log(err));
    }
    makeFullRequest(){
        fetch(URL2 + '/api/nodejs/makeFull/', {
            method: 'POST',
            body: JSON.stringify(this.props.graphs.find(g => g.id === this.props.graphId)),
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                this.props.setGraph(data);
                this.updateGraphRequest();
            }).catch(err => console.log(err));
    }
    cartesianRequest(){
        let secondGraph = this.props.graphs
            .find(g => g.name === prompt('Enter second graph name'));
        fetch(URL + '/api/v1/graph/' + this.props.graphId + ',' + secondGraph + '/cartesian', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> planarReduction request: ', data);
                this.props.setGraph(this.prepareGraph(data.planarGraph));
                this.updateGraphRequest();
            }).catch(err => console.log(err));
    }
    tensorRequest(){
        let secondGraph = this.props.graphs
            .find(g => g.name === prompt('Enter second graph name'));
        fetch(URL + '/api/v1/graph/' + this.props.graphId + ',' + secondGraph + '/tensor', {
            method: 'GET',
            ...REQUEST_OPTIONS
        })
            .then(response => response.json()).catch(err => console.log(err))
            .then(data => {
                console.log('Editor.js -> planarReduction request: ', data);
                this.props.setGraph(this.prepareGraph(data.planarGraph));
                this.updateGraphRequest();
            }).catch(err => console.log(err));
    }
    findShortestPathRequest(){
        let selectedVertexes = this.vertexes.filter(vertex => vertex.selected).sort((v1, v2) => v2.timestamp - v1.timestamp);
        if(selectedVertexes.length === 2) {
            fetch(`${URL}/api/v1/graph/${this.props.graphId}/shortestPath?fromNode=${selectedVertexes[0].id}&toNode=${selectedVertexes[1].id}` , {
                method: 'GET',
                ...REQUEST_OPTIONS
            })
                .then(response => response.json()).catch(err => console.log(err))
                .then(data => {
                    if(data.path !== null)
                        alert(data.path.map(vertex => vertex.id).join(','));
                    else alert('no path');
                }).catch(err => console.log(err));
        }
    }
    findAllPathsRequest(){
        let selectedVertexes = this.vertexes.filter(vertex => vertex.selected).sort((v1, v2) => v2.timestamp - v1.timestamp);
        if(selectedVertexes.length === 2) {
            fetch(`${URL}/api/v1/graph/${this.props.graphId}/allPath?fromNode=${selectedVertexes[0].id}&toNode=${selectedVertexes[1].id}` , {
                method: 'GET',
                ...REQUEST_OPTIONS
            })
                .then(response => response.json()).catch(err => console.log(err))
                .then(data => {
                    if(data.paths !== null)
                        alert(data.paths.map(path => path.map(vertex => vertex.id).join(',')).join('\n'));
                    else alert('no path');
                }).catch(err => console.log(err));
        }
    }
    findAllShortestPathsRequest(){
        let selectedVertexes = this.vertexes.filter(vertex => vertex.selected).sort((v1, v2) => v2.timestamp - v1.timestamp);
        if(selectedVertexes.length === 2) {
            fetch(`${URL}/api/v1/graph/${this.props.graphId}/allShortestPath?fromNode=${selectedVertexes[0].id}&toNode=${selectedVertexes[1].id}` , {
                method: 'GET',
                ...REQUEST_OPTIONS
            })
                .then(response => response.json()).catch(err => console.log(err))
                .then(data => {
                    if(data.paths !== null)
                        alert(data.paths.map(path => path.map(vertex => vertex.id).join(',')).join('\n'));
                    else alert('no path');
                }).catch(err => console.log(err));
        }
    }
    findDistance(){
        let selectedVertexes = this.vertexes.filter(vertex => vertex.selected).sort((v1, v2) => v2.timestamp - v1.timestamp);
        if(selectedVertexes.length === 2) {
            fetch(`${URL}/api/v1/graph/${this.props.graphId}/shortestPath?fromNode=${selectedVertexes[0].id}&toNode=${selectedVertexes[1].id}` , {
                method: 'GET',
                ...REQUEST_OPTIONS
            })
                .then(response => response.json()).catch(err => console.log(err))
                .then(data => {
                    if(data.path !== null)
                        alert(data.path.map(vertex => vertex.id).length - 1);
                    else alert('no path');
                }).catch(err => console.log(err));
        }
    }

    createNewVertex(x, y) {
        this.vertexes.push({
            x, y, id: getId(this.vertexes.map(vertex => vertex.id)),
            name: '', arcs: [], shape: VERTEX_SHAPE.STROKED
        });
    }

    getArcsFromId(ids) {
        if(!ids) throw new Error(`ids array is not array: ${ids}`);
        return this.arcs.filter(arc => ids.some(id => id === arc.id));
    }

    deleteSelectedVertexes() { //deletes all selected vertexes
        //two options of deleting vertexes:
        //1) delete via filter
        //2) delete via setting selected to null
        //if 1 then we need to delete arcs manualy using checkArcs() in update()
        //if 2 then vertexes and arcs will still be in arrays
        //like [...,null,...] for vertexes
        //and [...,{vertex1: null, vertex2: {..something} }, ...] for arcs
        this.vertexes = this.vertexes.filter(vertex => !vertex.selected); //1) option
        this.props.graphs.find(graph => graph.id === this.props.graphId).vertexes = this.vertexes;
        this.props.graphs.find(graph => graph.id === this.props.graphId).arcs = this.arcs;
        this.updateGraphRequest();
        // vertexes = vertexes.map(vertex => {if(vertex.selected) vertex = null;return vertex;}); //2) option
    }

    createNewArc(vertex1, vertex2, isDirected = false) {
        //создание новой дуги и вычисление углов между ее вершинами
        // if(vertex1.arcs.filter(id1 => vertex2.arcs.some(id2 => id1 === id2)).length !== 0 &&
        //     vertex1.id === vertex2.id) {
        //     alert('exists');return;
        // }

        if(vertex1.arcs.filter(id1 => vertex2.arcs.some(id2 => id1 === id2)).length !== 0 &&
            vertex1.id !== vertex2.id) {
            alert('exists');return;
        }
        this.arcs.push({
            vertex1, vertex2, isDirected, id: getId(this.arcs.map(arc => arc.id)),
            angle12: {
                sin: (vertex2.y - vertex1.y) / Math.sqrt((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2),
                cos: (vertex2.x - vertex1.x) / Math.sqrt((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2)
            },
            angle21: {
                sin: (vertex1.y - vertex2.y) / Math.sqrt((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2),
                cos: (vertex1.x - vertex2.x) / Math.sqrt((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2)
            }
        });
        //в обьекте вершины нужно иметь массив arcs который хранит все дуги с этой вершиной
        vertex1.arcs.push(this.arcs[this.arcs.length - 1].id);
        vertex2.arcs.push(this.arcs[this.arcs.length - 1].id);
        this.updateGraphRequest();
    }
    handleSwapOrientation(){
        let selectedVertexes = this.vertexes.filter(vertex => vertex.selected);
        if(selectedVertexes.length === 2) {
            for(let arc of this.arcs){
                if(!arc.isDirected) continue;
                if(arc.vertex1 === selectedVertexes[0] && arc.vertex2 === selectedVertexes[1]) {
                    arc.vertex1 = selectedVertexes[1];
                    arc.vertex2 = selectedVertexes[0];
                    this.updateAngles(arc);
                } else if(arc.vertex1 === selectedVertexes[1] && arc.vertex2 === selectedVertexes[0]) {
                    arc.vertex1 = selectedVertexes[0];
                    arc.vertex2 = selectedVertexes[1];
                    this.updateAngles(arc);
                }
            }
        }
    }
    handleDeleteArc(){
        let selectedVertexes = this.vertexes.filter(vertex => vertex.selected);
        let selectedArcId;
        if(selectedVertexes.length === 2){
            selectedArcId = selectedVertexes[0].arcs.find(a1 => selectedVertexes[1].arcs.some(a2 => a2 === a1))
        } else if(selectedVertexes.length === 1){
            for(let arc of this.arcs){
                if(arc.vertex1.id === selectedVertexes[0].id && arc.vertex2.id === selectedVertexes[0].id)
                    selectedArcId = arc.id;
            }
        }
        if(selectedArcId) this.arcs = this.arcs.filter(a => a.id !== selectedArcId);
    }

    updateAngles(arc) {
        //функция обновления углов между вершинами, должна вызываться когда одна из вершин перемещается
        arc.angle12 = {
            sin: (arc.vertex2.y - arc.vertex1.y) / Math.sqrt((arc.vertex2.x - arc.vertex1.x) ** 2 + (arc.vertex2.y - arc.vertex1.y) ** 2),
            cos: (arc.vertex2.x - arc.vertex1.x) / Math.sqrt((arc.vertex2.x - arc.vertex1.x) ** 2 + (arc.vertex2.y - arc.vertex1.y) ** 2)
        };
        arc.angle21 = {
            sin: (arc.vertex1.y - arc.vertex2.y) / Math.sqrt((arc.vertex2.x - arc.vertex1.x) ** 2 + (arc.vertex2.y - arc.vertex1.y) ** 2),
            cos: (arc.vertex1.x - arc.vertex2.x) / Math.sqrt((arc.vertex2.x - arc.vertex1.x) ** 2 + (arc.vertex2.y - arc.vertex1.y) ** 2)
        };
    }

    handleMouseDown(event) {
        if (this.state.paintMode) {
            this.isPainting = true;
            // this.paintingColor = this.state.colorInput;
        } else {
            this.selectedVertex = this.vertexes.find(vertex => Math.sqrt(((event.x) - vertex.x) ** 2 + ((event.y) - vertex.y) ** 2) <= (VERTEX_RADIUS));
            if (this.selectedVertex) {
                this.draggingOffset.X = event.x - this.selectedVertex.x;
                this.draggingOffset.Y = event.y - this.selectedVertex.y;
                this.isDragging = true;
                this.clickTimer = true;
                setTimeout(() => this.clickTimer = false, 300)
            }
        }
    }

    handleMouseMove(event) {
        if (this.state.paintMode && this.isPainting) {
            this.vertexes
                .filter(vertex => Math.sqrt(((event.x) - vertex.x) ** 2 + ((event.y) - vertex.y) ** 2) <= (VERTEX_RADIUS + 37))
                .forEach(vertex => vertex.color = this.state.paintingColor);
            this.arcs
                .filter(arc => Math.sqrt((event.x - (arc.vertex1.x + arc.vertex2.x) / 2) ** 2 + (event.y - (arc.vertex1.y + arc.vertex2.y) / 2) ** 2) <= 37)
                .forEach(arc => arc.color = this.state.paintingColor);
        } else if (this.isDragging === true) {
            this.selectedVertex.x = event.x - this.draggingOffset.X;
            this.selectedVertex.y = event.y - this.draggingOffset.Y;
            this.getArcsFromId(this.selectedVertex.arcs)
                .forEach(this.updateAngles);//обновление углов для всех дуг связанных с выбранной вершиной
        }
    }

    handleMouseUp(event) {
        if (this.state.paintMode && this.isPainting) {
            this.isPainting = false;
        } else if (this.isDragging === true) {
            this.isDragging = false;
            this.selectedVertex = this.clickTimer && this.vertexes.find(vertex => Math.sqrt(((event.x) - vertex.x) ** 2 + ((event.y) - vertex.y) ** 2) <= (VERTEX_RADIUS));
            if (this.selectedVertex) {
                this.selectedVertex.selected = !this.selectedVertex.selected;
                this.selectedVertex.selected && (this.selectedVertex.timestamp = new Date().getTime());
            }
            // selectedVertex = null;
            //непоянтно пока должна быть эта строчка или нет
            //если будут баги с выделением вершин, скорее всего ее надо раскоментить
            //пока подсчет степени выбранной веришны без этой строчки работает очень хорошо
        } else {
            this.vertexes.filter(vertex => vertex.selected).forEach(vertex => vertex.selected = false);
        }
        this.updateGraphRequest();
    }

    handleDoubleClick(event) {
        //creates new vertex under cursor on double click
        // this.createNewVertex(event.x, event.y);
        this.createNewVertex(event.x, event.y);
    }

    handleDeleteVertex() {
        this.deleteSelectedVertexes();
        // this.checkArcs();
    }

    handleNewArc(isDirected) {
        //creates an arc between two selected vertexes
        //if seletected more or less than 2 nothing happens
        let selectedVertexes = this.vertexes.filter(vertex => vertex.selected);
        if (selectedVertexes.length === 2) {
            this.createNewArc(selectedVertexes[0], selectedVertexes[1], isDirected)
        } else if (selectedVertexes.length === 1) {
            this.createNewArc(selectedVertexes[0], selectedVertexes[0], isDirected)
        }
    }

    handleVertexCount() {
        alert(`Vertexes count: ${this.vertexes.length}`);
    }

    handleArcCount() {
        alert(`Arcs count: ${this.arcs.length}`);
    }

    handleVertexPower() {
        let selectedVertexes = this.vertexes.filter(vertex => vertex.selected);
        if (selectedVertexes.length !== 0) alert(`Selected vertexes power: ${selectedVertexes.reduce((power, vertex) => power + vertex.arcs.length, 0)}`);
        else alert(`All vertexes power: ${this.vertexes.reduce((power, vertex) => power + this.getArcsFromId(vertex.arcs).length, 0)}`);
    }

    handleSwitchShape() {
        this.vertexes
            .filter(vertex => vertex.selected)
            .forEach(vertex => vertex.shape === VERTEX_SHAPE.STROKED ?
                (vertex.shape = VERTEX_SHAPE.FILLED) : (vertex.shape = VERTEX_SHAPE.STROKED));
    }

    handleChangeName() {
        this.vertexes.find(vertex => vertex.selected).name = prompt('Enter name: ');
    }

    handlePaintMode() {
        this.setState({paintMode: !this.state.paintMode});
    }

    handleColorChange(e) {
        this.setState({
            paintingColor: e.target.value
        });
    }

    checkArcs() {
        //deletes arcs that dont have one vertex
        //because if you delete vertex, arc tied to it also must be deleted

        // this.arcs = this.arcs.filter(arc => this.vertexes.indexOf(arc.vertex1) !== -1 && this.vertexes.indexOf(arc.vertex2) !== -1);
        this.arcs = this.arcs.filter(arc => this.vertexes.find(v => arc.vertex1.id === v.id) && this.vertexes.find(v => arc.vertex2.id === v.id));
        this.props.graphs.find(graph => graph.id === this.props.graphId).arcs = this.arcs;
    }

    drawVertexes() {
        if (this.vertexes.length) for (let vertex of this.vertexes) { //checks if there is at least one vertex  and interate throuh them
            this.ctx.beginPath();
            this.ctx.lineWidth = 5;
            vertex.selected ?
                this.ctx.strokeStyle = this.ctx.fillStyle = 'orange' : this.ctx.strokeStyle = this.ctx.fillStyle = vertex.color || 'black';
            this.ctx.arc(vertex.x, vertex.y, VERTEX_RADIUS, 0, 2 * Math.PI);
            this.ctx.stroke();
            vertex.shape === VERTEX_SHAPE.FILLED && this.ctx.fill();
            this.ctx.fillStyle = 'black';
            this.ctx.font = "12px Arial";
            this.showVertexIds && this.ctx.fillText(vertex.id, vertex.x + 1.5 * VERTEX_RADIUS, vertex.y + 1.5 * VERTEX_RADIUS);
            this.ctx.font = vertex.name && "14px Arial";
            vertex.name && this.ctx.fillText(vertex.name, vertex.x - 1.5 * VERTEX_RADIUS, vertex.y - 1.5 * VERTEX_RADIUS);
        }
    }

    drawArcs() {
        if (this.arcs.length) for (let arc of this.arcs) { //checks if there is at least one arc and interate throuh them
            //-------КОСТЫЛЬ---------
            arc.vertex1 = this.vertexes.find(v => v.id === arc.vertex1.id);
            arc.vertex2 = this.vertexes.find(v => v.id === arc.vertex2.id);
            //-----------------------
            this.ctx.strokeStyle = arc.color || 'black';
            this.ctx.fillStyle = arc.color || 'black';
            this.ctx.lineWidth = 1;
            let isLoop = false;

            //это короче точки которые непосредственно будут концами дуги
            let point1, point2;
            this.ctx.beginPath();
            if (arc.vertex1 === arc.vertex2) {
                isLoop = true;
                point1 = {
                    x: arc.vertex1.x,
                    y: arc.vertex1.y + VERTEX_RADIUS
                };
                point2 = {
                    x: arc.vertex2.x,
                    y: arc.vertex2.y + VERTEX_RADIUS
                };
                //checks if both vertexes exist and then draw arc
                //а нафига мне проверять существуют ли вершины, я чето не помню
                arc.vertex1 && arc.vertex2 && this.ctx.moveTo(point1.x, point1.y);
                //здесь числа это типо размеры рисуемой петли
                //можно было б вынести в константы, но мне чет влом
                arc.vertex1 && arc.vertex2 && this.ctx.bezierCurveTo(point1.x + 25, point1.y + 50,
                    point1.x - 25, point1.y + 50,
                    point2.x, point2.y);
            } else {
                //с помощью углов находим точки на окружности вершины которые будут концами отрезка дуги
                point1 = {
                    x: arc.vertex1.x + VERTEX_RADIUS * arc.angle12.cos,
                    y: arc.vertex1.y + VERTEX_RADIUS * arc.angle12.sin
                };
                point2 = {
                    x: arc.vertex2.x + VERTEX_RADIUS * arc.angle21.cos,
                    y: arc.vertex2.y + VERTEX_RADIUS * arc.angle21.sin
                };

                arc.vertex1 && arc.vertex2 && this.ctx.moveTo(point1.x, point1.y);
                arc.vertex1 && arc.vertex2 && this.ctx.lineTo(point2.x, point2.y);
            }
            this.ctx.stroke();

            if (arc.isDirected) {
                let angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
                // если петля, повернуть головку стрелки
                // нужный угол поворота был выяснен оптыным путем
                isLoop && (angle = -3.7 * Math.PI / 6);
                let R = 10;
                this.ctx.beginPath();
                this.ctx.moveTo(point2.x, point2.y);
                this.ctx.lineTo(point2.x - R * Math.cos(angle - Math.PI / 7),
                    point2.y - R * Math.sin(angle - Math.PI / 7));
                // путь от боковой точки стрелки к другой боковой точке
                this.ctx.lineTo(point2.x - R * Math.cos(angle + Math.PI / 7),
                    point2.y - R * Math.sin(angle + Math.PI / 7));
                // путь от боковой точки до кончика стрелки, а затем
                // снова в противоположную сторону
                this.ctx.lineTo(point2.x, point2.y);
                this.ctx.lineTo(point2.x - R * Math.cos(angle - Math.PI / 7),
                    point2.y - R * Math.sin(angle - Math.PI / 7));
                this.ctx.fill();
            }
            this.showVertexIds && this.ctx.fillText(arc.id, (arc.vertex1.x + arc.vertex2.x) / 2, (arc.vertex1.y + arc.vertex2.y) / 2);
        }
    }

    update(canvasWidth, canvasHeight) {
        this.checkArcs(); 	//comment if using 2) option of deleting
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.drawVertexes();
        this.drawArcs();
    }

    componentDidMount() {
        this.canvas.current.onselectstart = () => false;
        this.ctx = this.canvas.current.getContext('2d');
        setInterval(() => this.update(this.canvas.current.width, this.canvas.current.height), 15);
        setInterval(this.updateGraphReques, 500);
    }

    componentDidUpdate() {
        this.vertexes = this.props.graphs.find(graph => graph.id === this.props.graphId).vertexes;
        this.arcs = this.props.graphs.find(graph => graph.id === this.props.graphId).arcs;
    }

    getMouseEventWithOffset(event, canvas) {
        let rect = canvas.getBoundingClientRect();
        return ({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            // ...event
        });
    }

    render() {
        return (
            <div>
                <canvas
                    id="canvas"
                    width="1200" height="500"
                    style={
                        this.state.paintMode ? {
                                cursor: 'url(paint_cursor.png) 38 37, auto',
                                border: '1px solid #d3d3d3'
                            }
                            : {cursor: 'auto', border: '1px solid #d3d3d3'}
                    }
                    ref={this.canvas}
                    onMouseDown={e => this.handleMouseDown(this.getMouseEventWithOffset(e, this.canvas.current))}
                    onMouseMove={e => this.handleMouseMove(this.getMouseEventWithOffset(e, this.canvas.current))}
                    onMouseUp={e => this.handleMouseUp(this.getMouseEventWithOffset(e, this.canvas.current))}
                    onDoubleClick={e => this.handleDoubleClick(this.getMouseEventWithOffset(e, this.canvas.current))}
                >
                </canvas>

                <button onClick={() => this.handleNewArc(true)}>Oriented Arc</button>
                <button onClick={() => this.handleNewArc(false)}>Nooreinted Arc</button>
                <button onClick={this.handleSwapOrientation.bind(this)}>Swap orientation</button>
                <button onClick={this.handleDeleteArc.bind(this)}>Delete arc</button>

                <button onClick={this.handleChangeName.bind(this)}>Name</button>
                <button onClick={this.handleSwitchShape.bind(this)}>Switch vertex shape</button>
                <button onClick={this.handleDeleteVertex.bind(this)}>Delete vertex</button>
                <button onClick={this.handlePaintMode.bind(this)}>Paint</button>
                <input type="text" placeholder="#000000" onChange={this.handleColorChange.bind(this)}
                       value={this.state.paintingColor}/>

                <button onClick={() => this.showVertexIds = !this.showVertexIds}>Show vertexes ids</button>
                <button onClick={this.handleVertexCount.bind(this)}>Vertexes count</button>
                <button onClick={this.handleArcCount.bind(this)}>Arcs count</button>
                <button onClick={this.handleVertexPower.bind(this)}>Vertex power</button>
                <button onClick={this.findShortestPathRequest.bind(this)}>Find shortest path</button>
                <button onClick={this.findAllPathsRequest.bind(this)}>Find all paths</button>
                <button onClick={this.findAllShortestPathsRequest.bind(this)}>Find all shortest paths</button>
                <button onClick={this.findDistance.bind(this)}>Find distance</button>
                <button onClick={this.adjacencyMatrixRequest.bind(this)}>Adjacency matrix</button>
                <button onClick={this.incidenceMatrixRequest.bind(this)}>Incidence matrix</button>
                <button onClick={this.eulerianCycleRequest.bind(this)}>Eulerian cycle</button>
                <button onClick={this.hamiltonianPathRequest.bind(this)}>Hamiltonian Path</button>
                <button onClick={this.findDiameterRequest.bind(this)}>Find diameter</button>
                <button onClick={this.findRadiusRequest.bind(this)}>Find radius</button>
                <button onClick={this.findCenterRequest.bind(this)}>Find center</button>
                <button onClick={this.planarCheckRequest.bind(this)}>Planar check</button>
                <button onClick={this.planarReductionRequest.bind(this)}>Planar reduction</button>
                <button onClick={this.isTreeRequest.bind(this)}>Is tree</button>
                <button onClick={this.treeReductionRequest.bind(this)}>Tree reduction</button>
                {/*<button onClick={this.isFullRequest.bind(this)}>Is full</button>*/}
                {/*<button onClick={this.makeFullRequest.bind(this)}>Make full</button>*/}
                <button onClick={this.cartesianRequest.bind(this)}>Cartesian</button>
                <button onClick={this.tensorRequest.bind(this)}>Tensor</button>

            </div>
        );
    }
}
