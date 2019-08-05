import React, { Component } from 'react';
import {Glyphicon, PageHeader} from 'react-bootstrap';
import { connect } from 'react-redux';
import { sendMessage } from './chat';
import './App.css';
import Input from 'react-speech-recognition-input';
import Bot from './images/bot.png';
import User from './images/user.png';
import Robo from './images/robo.png';
import UserHead from './images/userhead.png';
import { Gmaps, Marker } from 'react-gmaps';
import YouTube from 'react-youtube'
import Ticket from './ticket';
import VoicePlayer from '../src/react-voice-components/lib/VoicePlayer';
import Request from 'superagent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' }
  }

  changingstate = (e) => {
    this.setState({ value: e.target.value })
  }
  keypress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.setState({
        value: '',
      });
    }

  }
  reset() {
    this.setState({
      value: '',
    });

  }
  
  getmap = (lat, lang) => {
    console.log(lat, lang);
  }
  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  }
  scrollToBottom = () => {
    var elm = document.getElementById("ap");
    elm.scrollIntoView();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  componentWillMount(){
    var url="http://10.123.79.234:9081/zosapiconnect/fetchapplicant/L0006";
    Request.get(url).then((response)=>{
      this.setState({
        name: response.body.JJAPCS13OperationResponse.ws_output_details.ws_applcnt_output_details.ws_first_name_o.ws_first_name_text_o,
        address: response.body.JJAPCS13OperationResponse.ws_output_details.ws_applcnt_output_details.ws_res_adr_ln4_o.ws_res_adr_ln4_text_o
      });
      //console.log(response.body.JJAPCS13OperationResponse.ws_output_details.ws_applcnt_output_details.ws_res_adr_ln4_o.ws_res_adr_ln4_text_o);
    });

  }
  render() {
    window.setInterval(function() {
      var elem = document.getElementById('element');
      elem.scrollTop = elem.scrollHeight;
    }, 1000);
    var onMapCreated = function (map) {
      map.setOptions({
        disableDefaultUI: true
      });
    }
   // var _onReady = function (event) {
      // access to player in all event handlers via event.target
      //event.target.pauseVideo();
    //}
    const { feed, sendMessage } = this.props;
    const opts = {
      height: '200',
      width: '300',
      playerVars: {
        autoplay: 1
      }
    };
   const user = this.state.name;
   var location = this.state.address;
    return (
      <div id="ap" className="App"  >
        <div className="headerTop">
            <span className="location">{location}</span>
            <Glyphicon className="marker" glyph="map-marker" />  
        </div>
        <div>
           <img className="headBot" src={Robo} alt="HeadBOT" />
             <h2>Movie Hub<img className="userImage" src={UserHead} alt="HeadBOT" />
             <span className="user">Hi,{user}</span>
             </h2>
        </div>
        
        <div id="result">
        <div id="element">
          {feed.map(function (entry, a) {
            if (entry.sender === 'bot') {
              return (<div className="botPad" key={a}><br /><img className="botImage" src={Bot} alt="boticon" /><div className='stylebot'><VoicePlayer play text={entry.text}user/>{entry.text}</div></div>)
            } else if (entry.sender === 'user') {
              return (<div className="userPad" key={a}><br /><img className="userImage" src={User} alt="boticon" /><div className='styleuser'>{entry.text}</div></div>)
            } else if (entry.sender === 'map') {
              return (<div className="botPad" key={a}><img className="botImage" src={Bot} alt="boticon" /><Gmaps className="styleMap" width={'300px'} height={'200px'} lat={entry.text[0]} lng={entry.text[1]} zoom={12} loadingMessage={'Loading'} onMapCreated={onMapCreated}><Marker lat={entry.text[0]} lng={entry.text[1]} draggable={true} /></Gmaps></div>)
            } else if (entry.sender === 'video') {
               return(<div className="botPad" key={a}><img className="botImage" src={Bot} alt="boticon" /><YouTube  className="styleVideo" videoId="XLJN4JfniH4" opts={opts} /></div>)
            } else if(entry.sender === 'book'){
              return(<div className="botPad"><img className="botImage" src={Bot} alt="boticon" /><VoicePlayer play text="Please select your seat"/>Please select your seat<Ticket/></div>)
            }else if(entry.sender === '_seat'){
              document.getElementsByClassName(entry.text)[0].style.backgroundColor = 'green';
            }
            
          })}
          </div>
        </div>
        <div className="input_bar">
          <Input type='text' className="test" onChange={(value) => console.log(value)} onEnd={(value) => { console.log(value); sendMessage(value); }} />
        </div>

      </div>
    );
  }
}
const mapStateToProps = state => ({
  feed: state
})
export default connect(mapStateToProps, { sendMessage })(App);