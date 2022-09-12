const accurateInterval = function(fn, time){
    let cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    wrapper = function(){
        nextAt+= time;
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        return fn();
    };
    cancel = function(){
        return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
        cancel: cancel
    };
};


class TimerControl extends React.Component{
    render(){
        return(
            <div id={this.props.id} className="length-control">
                <div id={this.props.titleid}>{this.props.title}</div>
                <button className="btn-control" id={this.props.decid} onClick={this.props.onClick} value="-"><i className="fa-solid fa-arrow-down"></i></button>
                <div className="lengthdisplay" id={this.props.lengthid}>{this.props.length}</div>
                <button className="btn-control" id={this.props.incid} onClick={this.props.onClick} value="+"><i className="fa-solid fa-arrow-up"></i></button>
            </div>
        );
    }
};

class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            breaklength: 5,
            sessionlength: 25,
            timerlabel: "Session",
            currenttime: 1500,
            clockstatus: "stop",
            interval: "",
            clockcolor: {color: "white"},    

        };
        this.countdown=this.countdown.bind(this);
        this.changetitle=this.changetitle.bind(this);
        this.clockrun=this.clockrun.bind(this);
        this.lengthControl=this.lengthControl.bind(this);
        this.handleClickBreak=this.handleClickBreak.bind(this);
        this.handleClickSession=this.handleClickSession.bind(this);        
        this.handleReset=this.handleReset.bind(this);
        this.handleStartStop=this.handleStartStop.bind(this);
    }

    countdown(){
        this.setState({
            interval: accurateInterval(()=>{
            this.setState({currenttime: this.state.currenttime-1});
            this.changetitle();
        },1000)});
    }

    changetitle(){
        if(this.state.currenttime < 61){
            this.setState({            
            clockcolor: {color: "red"} });}
       else{this.setState({            
            clockcolor: {color: "white"} })};
      
        if(this.state.currenttime === 0){document.getElementById("beep").play();}
        if(this.state.currenttime === 0){
            if(this.state.interval){this.state.interval.cancel();}
            if(this.state.timerlabel==="Session"){                
                this.setState({
                    timerlabel: "Break",
                    currenttime: this.state.breaklength * 60,
                    clockcolor: {color: "white"}
                });
              this.countdown();
                }
            else if(this.state.timerlabel==="Break"){              
              this.setState({
                    timerlabel: "Session",
                    currenttime: this.state.sessionlength * 60,
                    clockcolor: {color: "white"}
                });
              this.countdown();
              };
        };
        
    }

    clockrun(){        
        let minute = Math.floor(this.state.currenttime / 60);
        let second = this.state.currenttime - minute * 60;
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        return minute + " : " + second ; 
    };

    lengthControl(stateChange, sign, currentlength, timerlabel){
        if(this.state.clockstatus==="start"){return};  
        if(this.state.timerlabel===timerlabel){
            if(sign==="-" && currentlength > 1){
                this.setState({[stateChange]: currentlength - 1,
                            currenttime: currentlength * 60 - 60});
                           
            }
            else if(sign ==="+" && currentlength < 60)
                {this.setState({[stateChange]:  currentlength + 1,
                            currenttime: currentlength * 60 + 60});}
        }
        else {
        if(sign ==="-" && currentlength > 1){
            this.setState({[stateChange]: currentlength - 1});
                       
        }else if(sign ==="+" && currentlength < 60)
            {this.setState({[stateChange]:  currentlength + 1});}
            
        }
    };

    handleClickBreak(event){
        this.lengthControl(
            "breaklength", 
            event.currentTarget.value,
            this.state.breaklength,
            "Break");
    }

    handleClickSession(event){
        this.lengthControl(
            "sessionlength",
            event.currentTarget.value,
            this.state.sessionlength,
            "Session");
    }


    // handleClickBreak(event){      
    //     if(this.state.clockstatus==="start"){return};  
    //     if(this.state.timerlabel==="Break"){
    //         if(event.target.value=="-" && this.state.breaklength > 1){
    //             this.setState({breaklength: this.state.breaklength - 1,
    //                         currenttime: this.state.currenttime - 60});
                           
    //         }
    //         else if(event.target.value=="+" && this.state.breaklength < 60)
    //             {this.setState({breaklength:  this.state.breaklength + 1,
    //                         currenttime: this.state.currenttime + 60});}
    //     }
    //     else {
    //     if(event.target.value=="-" && this.state.breaklength > 1){
    //         this.setState({breaklength: this.state.breaklength - 1});
                       
    //     }else if(event.target.value=="+" && this.state.breaklength < 60)
    //         {this.setState({breaklength:  this.state.breaklength + 1});}
            
    //     }
    // };

    // handleClickSession(event){
    //     if(this.state.clockstatus==="start"){return};
    //     if(this.state.timerlabel==="Session"){
    //         if(event.target.value=="-" && this.state.sessionlength > 1){
    //         this.setState({sessionlength: this.state.sessionlength-1,
    //                         currenttime: this.state.currenttime - 60});
                       
    //     }else if(event.target.value=="+" && this.state.sessionlength < 60)
    //         {this.setState({sessionlength:  this.state.sessionlength + 1,
    //                         currenttime: this.state.currenttime + 60});}
    //     }    
    //     else {
    //     if(event.target.value=="-" && this.state.sessionlength > 1){
    //         this.setState({sessionlength: this.state.sessionlength-1});
    //         if(this.state.timerlabel==="Session"){this.setState({currenttime: this.state.currenttime - 60});}            
    //     }else if(event.target.value=="+" && this.state.sessionlength < 60)
    //         {this.setState({sessionlength:  this.state.sessionlength + 1});}
    //         if(this.state.timerlabel==="Session"){this.setState({currenttime: this.state.currenttime + 60});}
    //     }
    // };

    handleReset(){
        this.setState({
            breaklength: 5,
            sessionlength: 25,
            timerlabel: "Session",
            currenttime: 1500,
            clockstatus: "stop",
            interval: "",
            clockcolor: {color: "white"},
        })
        if(this.state.interval){this.state.interval.cancel();}

        document.getElementById("beep").pause();
        document.getElementById("beep").currenttime=0;
    };

    handleStartStop(){
        if(this.state.clockstatus==="stop"){             
            this.setState({clockstatus: "start"});
            this.countdown();       
        }
        else {                                 
            this.setState({clockstatus: "stop"});
            if(this.state.interval){this.state.interval.cancel()};             
        }        
    };

    render(){              
        let timerlabel=this.state.timerlabel;
        // console.log(this.state.breaklength);
        // console.log(this.state.sessionlength);
        // console.log(this.state.currenttime);
        return(
            <div className="clock-app">
                <h1>25 + 5 Clock</h1>
                
                <TimerControl id="breaklengthstyle" titleid="break-label" title="Break Length"
                            decid="break-decrement" incid="break-increment"
                            lengthid="break-length" length={this.state.breaklength}
                            onClick={this.handleClickBreak} />
                <TimerControl id="sessionlengthstyle" titleid="session-label" title="Session Length"
                            decid="session-decrement" incid="session-increment"
                            lengthid="session-length" length={this.state.sessionlength}
                            onClick={this.handleClickSession}/>
                
                <div className="clockdisplay">
                    <div className="timelabel" id="timer-label">{timerlabel}</div>
                    <div className="timeleft" id="time-left" style={this.state.clockcolor}>{this.clockrun()}</div>                    
                </div>
                <button className="btn-control btnbottom" id="start_stop" onClick={this.handleStartStop}><i className="fa-solid fa-play"></i><i className="fa-solid fa-pause"></i></button>
                <button className="btn-control btnbottom" id="reset" onClick={this.handleReset}><i className="fa-solid fa-rotate"></i></button>
                <audio id="beep" preload="auto" src="https://www.fesliyanstudios.com/play-mp3/3518" />
            </div>
        );
    }
};


const container = document.getElementById("container");
const root = ReactDOM.createRoot(container);
root.render(<App />);