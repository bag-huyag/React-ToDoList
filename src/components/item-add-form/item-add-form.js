import React, { Component } from 'react';
import './item-add-form.css';

export default class ItemAddForm extends Component
{
    state = {
        label: ''
    };

    onLabelChange = (e) => {
        //console.log(e.target.value)
        // поскольку наш предыдущий стейт не зависит
        // от предыдущего стейта, то мы можем просто передать туда значение
        this.setState({
            label: e.target.value
        });

    };
    onSubmit = (e) => {
        e.preventDefault();
        this.props.onItemAdded(this.state.label);
        //e.target.querySelector('input').value = '';
        this.setState({
            label:''
        })

    };

   render()
   {
       return (
           <form className="item-add-form d-flex"
                 onSubmit={this.onSubmit}
               >
               <input type="text"
                className="from-control"
                onChange={this.onLabelChange}
                placeholder="What need to be done"
                value={this.state.label}
               />
               <button
               className="btn btn-outline-secondary">Add Item</button>

           </form>
       )
   }
}