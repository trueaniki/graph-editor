const express = require('express');
const cors = require('cors');
const app = express();

const getId = require('./getId');

const PORT = 9000;

app.use(cors());
app.use(express.json());

app.post('/api/nodejs/checkFull/', (req, res) => {
    let arcCount = 0;
    for(let arc of req.body.arcs) {
        if(arc.vertex1.id !== arc.vertex2.id) arcCount++;
    }
    let n = req.body.vertexes.length;
    if(arcCount === n*(n-1)/2)
        res.end(JSON.stringify(true));
    else
        res.end(JSON.stringify(false));
});

app.post('/api/nodejs/makeFull/', (req, res) => {
    let graph = req.body;
    let vertexesMap = graph.arcs.map(a => [a.vertex1.id, a.vertex2.id]);
    for(let vertex1 of graph.vertexes)
        for(let vertex2 of graph.vertexes) {
            if(vertex1 !== vertex2) {
                if(!vertexesMap.find(pair => pair.includes(vertex1.id) && pair.includes(vertex2.id))) {
                    vertexesMap.push([vertex1.id, vertex2.id]);
                    graph.arcs.push({
                        vertex1, vertex2, isDirected: false, id: getId(graph.arcs.map(arc => arc.id)),
                        angle12: {
                            sin: (vertex2.y - vertex1.y) / Math.sqrt((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2),
                            cos: (vertex2.x - vertex1.x) / Math.sqrt((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2)
                        },
                        angle21: {
                            sin: (vertex1.y - vertex2.y) / Math.sqrt((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2),
                            cos: (vertex1.x - vertex2.x) / Math.sqrt((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2)
                        }
                    });
                    vertex1.arcs.push(graph.arcs[graph.arcs.length - 1].id);
                    vertex2.arcs.push(graph.arcs[graph.arcs.length - 1].id);
                }
            }
        }
    console.log(graph.arcs.length);
    res.end(JSON.stringify(graph));
});

app.listen(PORT, () => {
    console.log('Listening on port ', PORT);
});