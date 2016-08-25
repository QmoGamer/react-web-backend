import React from 'react'
import axios from 'axios'
var Waypoint = require('react-waypoint');
var PropTypes = React.PropTypes;

var ArticleAnchor = React.createClass({
	getInitialState:function(){
    return {data: [], config: [], needs_fix: false, top:this.props.top, threshold:this.props.threshold}
  },
  componentWillMount:function(){
		axios.get('/api/json/configs').then((result)=>{
    	var conf = {}
    	result.data.forEach(x=>conf[x.name] = x.value)
    	this.setState({config: conf})
    })
  },
  componentWillReceiveProps(nextProps){
  	axios.get('/api/json/menus/'+this.props.member).then((result)=>axios.get('/api/json/articles/'+result.data.ArticleId).then((result)=>this.setState({data:result.data.anchor})))
  },
	render() {  	
		var style = { position: "initial", backgroundColor: this.state.config.anchor_bgcolor } 
		if(this.state.needs_fix) {
			 style.position = "fixed"
			 style.top = this.state.top
		}
		var a_style = { color: this.state.config.header_main_color }
	
		if( this.state.data.length != 0 ) {
			var anchor = this.state.data.map((x, i)=><a key={"anchor_"+i} style={a_style} href={x.anchor}>{x.name}</a>)
			var toggle = "block"
		}
		else
			var toggle = "none"

		return (
			<div style={{ display: toggle }}>
				<Waypoint ref='threshold' threshold={this.state.threshold} onEnter={()=>this.setState({needs_fix:false})} onLeave={()=>this.setState({needs_fix:true})} />
				<div className="menu_sub_style" style={style}>
					<div className="html_width_space">
						<div style={{height: "1.5em"}}>
							{anchor}
						</div>
					</div>
				</div>
			</div>
		);
	}
})

export default ArticleAnchor