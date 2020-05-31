import React from 'react'
import {v4 as uuid} from 'uuid'

export default class Tabs extends React.Component {
	constructor(props){
		super(props);

		// this.state = {
		// 	graphs: this.props.graphs,
		// 	selectedGraphId: this.props.graphId
		// };
	}
	handleCreateNewGraph() {
	    let newGraph = {name: prompt('Enter name of graph')};
	    this.props.onGraphCreated(newGraph);
		// this.setState({
		// 	graphs: [...this.state.graphs, newGraph]
		// });
	}
	handleGraphSelected(graph) {
		this.setState({selectedGraphId: graph.id});
		this.props.onTabChange(graph.id);
	}
	render(){
		return(
			<div>
				{this.props.graphs.map(graph =>
					<Tab key={graph.id}
						 graph={graph} 
						 onSelect={this.handleGraphSelected.bind(this)}
						 isSelected={this.props.graphId === graph.id}/>
				)}
				<button onClick={this.handleCreateNewGraph.bind(this)}>+</button>
			</div>
		);
	}
}

class Tab extends React.Component {
	constructor(props){
		super(props);
	}
	handleTabSelected(){
		this.props.onSelect(this.props.graph);
	}
	render(){
		return(
			<button className="tab-button" onClick={this.handleTabSelected.bind(this)}>
				{this.props.isSelected ? <b>{this.props.graph.name}</b> : this.props.graph.name}
			</button>
		);
	}
} 