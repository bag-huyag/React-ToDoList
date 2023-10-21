import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class extends Component {

    maxId = 100;

    state = {
        todoData : [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Make awesome App'),
            this.createTodoItem('have a lunch')
        ],
        term: '',
        filter: 'all' // active, all, done
    };

    createTodoItem (label) {
      return {
          label: label,
          important: false,
          done: false,
          id: this.maxId++
      }
    }

    deleteItem = (id) => {
        this.setState(({todoData}) => {
            const idx = todoData.findIndex((el) => el.id === id);
            //todoData.splice(idx, 1);

            const before = todoData.slice(0, idx);
            const after = todoData.slice(idx + 1);


            const newArray = [...before, ...after];
            return {
                todoData: newArray
            }
        })
    };

    addItem = (text) => {
        const newItem = this.createTodoItem(text);
        this.setState(({todoData}) => {

            const newArr = [
                ...todoData,
                newItem
            ];
            return {
                todoData:newArr
            }
        });



    };

    // общая для ToggleDone и ToggleImportant функция

    toggleProperty(arr, id, propName)
    {
        // arr в данном случае это todoData

        // 1. find and update object
        // 2. construct new array to return to state

        const idx = arr.findIndex((el) => el.id === id);

        const oldItem = arr[idx];

        // нельзя напрямую изменять свойства объекта в state
        // поэтому нам надо скопировать его свойства в новый объект
        // спред-оператором и перезаписать в новом объекте состояние свойства done
        // при этом старый элемент мы вообще не изменяли

        const newItem = {...oldItem, [propName]: !oldItem[propName]};

        // нельзя напрямую изменять объект todoData
        // поэтому мы его делим на части "до" и "после"

        const before = arr.slice(0, idx);
        const after = arr.slice(idx + 1);

        // а между ними вставляем наш новый объект

        return [
            ...before,
            newItem,
            ...after ];
    }

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            return {
               todoData: this.toggleProperty(todoData, id, 'done')
            }

        });
    };

    onToggleImportant = (id) => {

        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
        }

        });
    };

    search(items, term)
    {
        if(term.length === 0)
        {
            return items;
        }
        return items.filter((item) =>{
            return item.label
                .toLowerCase()
                .indexOf(term.toLowerCase()) > -1;
        })
    }
    onSearchChange = (term) =>
    {
        this.setState ({term});
    };
    onFilterChange = (filter) =>
    {
        this.setState ({filter});
    };

    filter(items, filter)
    {
        switch(filter)
        {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case 'done':
                return items.filter((item) => item.done);
            default:
                return items;
        }
    }

    render ()
    {
        // получение кол-ва элементов в состоянии "Done"
        // filter() создает новый массив, поэтому мы не
        // изменяем state

        const { todoData, term, filter } = this.state;
        const visibleItems = this.filter(
                this.search(todoData, term), filter);

        const doneCount = todoData
            .filter((el) => el.done)
            .length;
        const todoCount = todoData.length - doneCount;

        return (
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount} />
                <div className="top-panel d-flex">
                    <SearchPanel
                    onSearchChange={this.onSearchChange}
                    />
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange}
                    />
                </div>

                <TodoList
                    todos={ visibleItems }
                    onDeleted={ this.deleteItem }
                    onToggleImportant={this.onToggleImportant}
                    onToggleDone={this.onToggleDone}
                />
                <ItemAddForm onItemAdded={ this.addItem }/>
            </div>
        );
    };


};