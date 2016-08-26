import React from 'react'
import MediaQuery from 'react-responsive'
import {Link} from 'react-router'
import axios from 'axios'
import InfinityMenu from "react-infinity-menu"

//==========

var Menu2 = require('react-burger-menu').slide;
var styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '1.5em',
    height: '1.5em',
    right: '0.8em',
    top: '0.7em',
	zIndex: '999',
	color: '#6a6a6a'
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmCross: {
    background: 'white'
  },
  bmMenu: {
    background: 'black',
    padding: '2.0em 0 0',
    //fontSize: '1.15em',
		// borderLeft:'2px solid rgba(150,150,150,1)'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmMenuWrap: {
  	width: "100%"
  }
}

//==========

var MenuRow = React.createClass({
	getInitialState(){
		return {config: [], second_data: [], third_data: [], tree: [this.props.group||0, this.props.team||0, this.props.member||0]}
	},
	componentWillMount(){
		axios.get('/api/json/menus').then((result)=>
			{
				var second_data = []
				var third_data = []

				if( this.state.tree[0] != 0 ) {
					var filter_data = this.props.data.filter((x)=>{ return x.id == this.state.tree[0] })
					second_data = filter_data[0].children ? filter_data[0].children : []
				}
				
				if( this.state.tree[1] != 0 && second_data.length != 0 ) {
					var filter_data = second_data.filter((x)=>{ return x.id == this.state.tree[1] })
					third_data = filter_data[0].children ? filter_data[0].children : []
				}

				this.setState({ 
					second_data: second_data,
					third_data: third_data
				})
			}
		)
		axios.get('/api/json/configs').then((result)=>{
    	var conf = {}
    	result.data.forEach(x=>conf[x.name] = x.value)
    	this.setState({config: conf})
    })
	},
	componentWillReceiveProps(nextProps){
		if( nextProps.group == null && (this.state.tree[0] != 0 || this.state.tree[1] != 0 || this.state.tree[2] != 0) ) {
			this.setState({ tree: [0, 0, 0] })
			window.waypointer = null
		}
	},
	componentDidUpdate(prevProps, prevState){
		if(this.state.tree != prevState.tree) {
			if(this.state.tree[0] == 0)
				this.setState({ second_data: [] })
			else {
				var second_data = this.props.data.filter((x)=>{
  				return x.id == this.state.tree[0]
	  		})
	  		second_data[0].children != null ? second_data = second_data[0].children : second_data = []	 
				this.setState({ second_data: second_data })
			}
		}

		if(this.state.tree != prevState.tree) {
			if(this.state.tree[1] == 0)
				this.setState({ third_data: [] })
			else {
				var third_data = this.state.second_data.filter((x)=>{
  				return x.id == this.state.tree[1]
	  		})
	  		third_data[0].children != null ? third_data = third_data[0].children : third_data = []	 
				this.setState({ third_data: third_data })
			}
		}

		if(document.querySelector("#page")) {
			if(this.state.third_data.length != 0 ) {
				document.querySelector("#page").style.paddingTop = '3em'
				window.waypointer == null ? null : window.waypointer.setState({top:'7.5em', threshold: -0.12})
			}
			else if(this.state.second_data.length != 0) {
				document.querySelector("#page").style.paddingTop = '1.5em'
				window.waypointer == null ? null : window.waypointer.setState({top:'6em', threshold: -0.10})
			}
			else {
				document.querySelector("#page").style.paddingTop = '0em'
				window.waypointer == null ? null : window.waypointer.setState({top:'4.5em', threshold: -0.08})
			}
  	}
	},
	setGroupFunction(id){
		//if( id == this.state.tree[0] )
		//	id = 0
		var new_tree = [id, 0, 0]
		this.setState({ tree: new_tree })
	},
	setTeamFunction(id){
		//if( id == this.state.tree[1] )
		//	id = 0
		var new_tree = [this.state.tree[0], id, 0]
		this.setState({ tree: new_tree })
	},
	setMemberFunction(id){
		//if( id == this.state.tree[2] )
		//	id = 0
		var new_tree = [this.state.tree[0], this.state.tree[1], id]
		this.setState({ tree: new_tree })
	},
	render() {
		return (
  		<MediaQuery query='(min-width: 768px)'>     
  			<div style={{backgroundColor: this.state.config.header_main_bgcolor}}>    			
					<MenuFirstRow clickFunction={this.setGroupFunction} data={this.props.data} config={this.state.config} group={this.state.tree[0]} />
				</div>
				<div style={{backgroundColor: this.state.config.header_second_bgcolor}}>    			
					<MenuSecondRow clickFunction={this.setTeamFunction} data={this.state.second_data} config={this.state.config} team={this.state.tree[1]} />  				
				</div>	
				<div style={{backgroundColor: this.state.config.header_third_bgcolor}}>    			
					<MenuThirdRow clickFunction={this.setMemberFunction} data={this.state.third_data} config={this.state.config} group={this.state.tree[0]} member={this.state.tree[2]} />					
				</div>
			</MediaQuery>
    )
	}
})

var MenuFirstRow = React.createClass({
	render() {
		return (
				<div className="menu_row html_width_space">
					{
						this.props.data.map((x, i)=>{
							var bg_color = x.id == this.props.group ? this.props.config.header_main_select_bgcolor : this.props.config.header_main_bgcolor

							if( x.component == "url" ) {
								return <a key={"frist_menu_"+i} className="first_row" style={{color: this.props.config.header_main_color, backgroundColor: bg_color}} href={x.url}><span className="small_font_size">{x.name}</span></a>
							}
							else if ( x.component == "product" || x.component == "course" ) {
								return <div key={"frist_menu_"+i} onClick={()=>this.props.clickFunction(x.id)} className="first_row" style={{color: this.props.config.header_main_color, backgroundColor: bg_color}}><span className="small_font_size">{x.name}</span> <span style={{verticalAlign: "sub"}}>▾</span></div>  			
							}
							else {
								return <a key={"frist_menu_"+i} onClick={()=>this.props.clickFunction(x.id)} href={"/"+x.component+"/"+x.id} className="first_row" style={{color: this.props.config.header_main_color, backgroundColor: bg_color}}><span className="small_font_size">{x.name}</span></a>
							}
						})
					}
				</div>
		)
	}
})

var MenuSecondRow = React.createClass({
	render() {		
		return (
			<div className="menu_row html_width_space" style={{display: this.props.data.length == 0 ? "none" : "flex"}}>
				{
					this.props.data.map((x, i)=>{
						var color = x.id == this.props.team ? this.props.config.header_second_select_color : this.props.config.header_second_color

						if(x.children == null) {
							if( x.component == "url" ) 
								return <a key={"second_menu_"+i} className="second_row" style={{color: color}} href={x.url}><span className="small_font_size">{x.name}</span></a>
							else 
								return <a key={"second_menu_"+i} onClick={()=>this.props.clickFunction(x.id)} href={"/"+x.component+"/"+x.MenuId+"/"+x.id} className="second_row" style={{color: color}}><span className="small_font_size">{x.name}</span></a>
						}
						else {
							return (
								<div key={"second_menu_"+i} onClick={()=>this.props.clickFunction(x.id)} className="second_row" style={{color: color}}><span className="small_font_size">{x.name}</span> <span style={{verticalAlign: "sub"}}>▾</span></div>
							)
						}
		    	})
				}
			</div>				
		)
	}
})

var MenuThirdRow = React.createClass({
	render(){
		return(
			<div className="menu_row html_width_space" style={{display: this.props.data.length == 0 ? "none" : "flex"}}>				
				{					
					this.props.data.map((x, i) => {				
						var bgcolor = x.id == this.props.member ? this.props.config.header_third_select_bgcolor : this.props.config.header_third_bgcolor

						if( x.component == "url" )
							return <a key={"third_menu_"+i} className="third_row" style={{color: this.props.config.header_third_color, backgroundColor: bgcolor}} href={x.url}><span className="small_font_size">{x.name}</span></a>
						else
							return <a key={"third_menu_"+i} onClick={()=>this.props.clickFunction(x.id)} className="third_row" style={{color: this.props.config.header_third_color, backgroundColor: bgcolor}} key={"third_menu_"+i} href={"/"+x.component+"/"+this.props.group+"/"+x.MenuId+"/"+x.id}><span className="small_font_size">{x.name}</span></a>
					})
				}
			</div>
		)
	}
})

var MenuSide = React.createClass({
	getInitialState:function(){		
    return { tree: [] }
  },
	onNodeMouseClick(event, tree, node, level, keyPath) {
      this.setState({ tree: tree })
  },
  componentDidUpdate:function(prevProps){
  	if(this.state.tree.length == 0){
  		this.makeComponent(this.props.data)
	  	this.setState({ tree: this.props.data })
  	}
  },
  makeComponent(x){
  	x.map((child)=>{  	  	
  		if(child.children){
  			delete child.customComponent 
  			this.makeComponent2(child.children, child.id)
  		}
  		else{
  			if(child.customComponent=="leaf")
  				child.customComponent = leaf
  			else if(child.customComponent=="url")
  				child.customComponent = url
  			else 
  				delete child.customComponent
  		}
  	})   	
  },
  makeComponent2(x,id){
  	x.map((child)=>{
  		id != null ? child.first_parent_id = id : ""
  		if(child.children){
  			delete child.customComponent
  			this.makeComponent2(child.children, id)
  		}
  		else{
  			if(child.customComponent=="leaf")
  				child.customComponent = leaf
  			else if(child.customComponent=="url")
  				child.customComponent = url
  			else 
  				delete child.customComponent
  		}
  	})  
  },
  render() {
    return (
    	<MediaQuery query='(max-width: 767px)'>
				<Menu2 right={true} styles={styles} pageWrapId={ "page-wrap" } outerContainerId={ "root" } id="page-wrap" >
					<div className="pure-menu">
						<InfinityMenu tree={this.state.tree} onNodeMouseClick={this.onNodeMouseClick} />
					</div>
				</Menu2>
			</MediaQuery>
    )
  }
})

var url = React.createClass({
	render(){
		return <div className="infinity-menu-leaf-container"><a href={this.props.data.url}>{this.props.data.name}</a></div>
	}
})
var leaf = React.createClass({
	render(){
		if ( this.props.data.first_parent_id == this.props.data.MenuId ) {
			return <li className="infinity-menu-leaf-container"><a href={"/"+this.props.data.component+"/"+this.props.data.MenuId+"/"+this.props.data.id}>{this.props.data.name}</a></li>
		}
		else {
			return <li className="infinity-menu-leaf-container"><a href={"/"+this.props.data.component+"/"+this.props.data.first_parent_id+"/"+this.props.data.MenuId+"/"+this.props.data.id}>{this.props.data.name}</a></li>
		}
	}
})
var container = React.createClass({
	render(){
		return <div className="infinity-menu-node-container">{this.props.data.name}</div>
	}
})

var MenuTop = React.createClass({
	getInitialState:function(){
    return {data:[]}
  },
  componentWillMount:function(){
    axios.get('/api/json/menus').then((result)=>this.setState({data:result.data}))
  },
	render(){
		var member_icon = this.props.signin == true ? "/img/icon-on-member.jpg" : "/img/icon-off-member.jpg"

		return(
			<div className='pure-menu pure-menu-fixed pure-menu-horizontal' style={{background:'white',textAlign:'left', width: '100%'}}>
				<div className="html_width_space flex_center_center">
					<div style={{display: "flex", alignItems: "center"}}>
						<Link to="/" style={{"marginLeft": "1em"}}><img style={{padding: "0em"}} className='pure-menu-heading' href="#" src="http://placehold.it/150x48" /></Link>
						<div style={{marginTop: "16px", letterSpace: "1px", color: "#585858"}}>SLOGAN</div>
					</div>
					<li className="pure-menu-item"  style={{right: "0em"}}>
						<Link className="language_link" to="/member" style={{display: "inline-block"}}><img src={member_icon} width="24px" /></Link>
						{/*<a className="language_link" href="#" style={{display: "inline-block"}}>CN</a>
						<a className="language_link" href="#" style={{display: "inline-block"}}>TW</a>*/}
					</li>
				</div>
				<MenuSide data={this.state.data} />
				<MenuRow data={this.state.data} group={this.props.group} team={this.props.team} member={this.props.member} />			
			</div>
		)
	}
})
export default MenuTop
