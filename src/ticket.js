import React, { Component } from 'react';
import './ticket.css';

export default class Ticket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: ['A', 'B', 'C', 'D']
        }
    }
    
    render() {
        // window.setInterval(function(){var elem = document.getElementsByClassName('B2');elem.style.display = 'grey';},5000);
        return (
            <table>
                <tbody>
                    {this.state.rows.map((i,a) => {
                        return(<tr key={a}><td>{i}</td><td>{[1,2,3,4].map((j,a)=>{var name=i+j+' seatI';return(<div  className={name} key={a}>{i}{j}</div>)})}</td></tr>);
                    })}
                </tbody>
            </table>
        )
    }
}