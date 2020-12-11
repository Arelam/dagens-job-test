import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export default class ProductForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uuid: uuidv4(),
			name: '',
			category: '',
			price: 0
		};

		// https://stackoverflow.com/questions/36683770/how-to-get-the-value-of-an-input-field-using-reactjs
		//this.handleInputChange = this.handleInputChange.bind(this);
		//this.handleSubmit = this.handleSubmit.bind(this);
	}

	resetFormValues() {
		this.setState({
			uuid: uuidv4(),
			name: '',
			category: '',
			price: 0
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		alert('submit '+this.state.uuid+' '+this.state.name);
		console.log(this.state.uuid);
		this.resetFormValues();
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	render() {
		return(
			<form onSubmit={evt => this.handleSubmit(evt)}>
				<label>Product name
					<input name='name' type='text' value={this.state.name} onChange={evt => this.handleInputChange(evt)} />
				</label>
				<label>Category
					<input name='category' type='text' value={this.state.category} onChange={evt => this.handleInputChange(evt)} />
				</label>
				<label>Price
					<input name='price' type='number' value={this.state.price} onChange={evt => this.handleInputChange(evt)} />
				</label>
				<button type='submit'>Create product</button>
			</form>
		);
	}
}