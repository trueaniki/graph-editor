import React from 'react'
import Tabs from './Tabs'
import Editor from './Editor'
import {URL, REQUEST_OPTIONS} from './constants'
import {v4 as uuid} from 'uuid'
import axios from 'axios'
import copyObj from "./copyObj";
import './style.css'

export default class Root extends React.Component {
	constructor(props){
		super(props);
        // this.graphs = [
        //     {id: firstGraphId, name: 'graph_1', vertexes: [], arcs: []},
        //     {id: 2, name: 'graph_2', vertexes: [], arcs: []},
        //     {id: 3, name: 'graph_3', vertexes: [], arcs: []}
        //     ];
		this.isGraphListReady = false;
		this.isComponentMounted = false;
		this.getGraphList();
		this.state = {
			graphs: [],
			graphId: null
		}
	}
	componentDidMount() {
		this.isComponentMounted = true;
		if(this.isGraphListReady && this.graphList)
			this.setState({
				graphs: this.graphList,
				graphId: this.graphList[0].id
			})
	}

	getGraphList() {
		fetch(URL + '/api/v1/graph/list', {
			method: 'GET',
			...REQUEST_OPTIONS
		})
			.then(response => response.json()).catch(err => console.log(err))
			.then(data => {
				let preparedGraphList = this.prepareGraphList(data);
				if(this.isComponentMounted) {
					this.setState({
						graphs: preparedGraphList,
						graphId: preparedGraphList[0].id
					})
				} else {
					this.isGraphListReady = true;
					this.graphList = preparedGraphList;
				}
			}).catch(err => console.log(err));
	}
	prepareGraphList(graphList){
		let preparedGraphList = graphList
			// .filter(graph => graph)
			.map(graph => this.prepareGraph(graph))
			.sort((g1, g2) => g2.timestamp - g1.timestamp);
		if(preparedGraphList === undefined) throw new Error('preparedGraphList is undefined');
		return copyObj(preparedGraphList);
	}
	prepareGraph(graph){
		for(let vertex of graph.vertexes){
			vertex.arcs = [];
			for(let arc of graph.arcs){
				if(arc.vertex1.id === vertex.id && arc.vertex2.id === vertex.id) {
					vertex.arcs.push(arc.id);
					vertex.arcs.push(arc.id);
				} else if((arc.vertex1.id === vertex.id || arc.vertex2.id === vertex.id)) {
					vertex.arcs.push(arc.id);
				}
			}
		}
		return copyObj(graph);
	}
	onGraphCreated(newGraph){
	    newGraph.vertexes = [];
	    newGraph.arcs = [];
	    newGraph.timestamp = new Date().getTime();

		fetch(URL + '/api/v1/graph', {
			method: 'POST',
			body: JSON.stringify(newGraph),
			...REQUEST_OPTIONS
		})
			.then(response => response.json()).catch(err => console.log(err))
			.then(data => {
				newGraph.id = data.id;
				this.setState({
					graphs: [newGraph, ...this.state.graphs],
					graphId: newGraph.id,
				});
			}).catch(err => console.log(err));
    }
	setGraph(graph) {
		this.setState({
			graphs: [graph, ...this.state.graphs.filter(g => g.id !== graph.id)]
		});
	}
	render(){
		return(
			<div>
				<Tabs
                    onTabChange={graphId => this.setState({graphId})}
                    onGraphCreated={newGraph => this.onGraphCreated(newGraph)}
                    graphs={this.state.graphs}
					graphId = {this.state.graphId}
                />
				{this.state.graphs.length !== 0 &&
					<Editor
						graphId={this.state.graphId}
						graphs={this.state.graphs}
						setGraph={graph => this.setGraph(graph)}
					/>
				}
			</div>
		);
	}
} 