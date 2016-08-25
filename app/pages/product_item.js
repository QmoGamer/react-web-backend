import React from 'react'
import MediaQuery from 'react-responsive'
import {Link} from 'react-router'
import axios from 'axios'

//==========

var a = {
	display: "block",
	position: 'absolute',
	bottom: '1em',
	right: '1em'
}

var flexbox = {
	display: 'flex',
	justifyContent: 'space-around',
	flexDirection: 'row'
}

//==========

var ProductRow = React.createClass({
	render() {
		var flexbox_style = Object.assign({}, flexbox)
		if( this.props.img_position == 'right' ) {
			flexbox_style.flexDirection = "row-reverse"
		}

		var a_link = this.props.article_id != "0" ? <Link to={"article/"+this.props.article_id} style={a}>更多資訊...</Link> : ""

		return (
			<div className="pure-g" style={flexbox_style}>
			    <img className="pure-u-1-2" src={this.props.img} />
			    <div className="pure-u-1-2" style={{position: 'relative'}}>			    	
			    	<div style={{padding: "1.5em", wordBreak: "normal", wordWrap: "break-word"}}>{this.props.text}</div>
			    	{a_link}
			    </div>
			</div>
		);
	}
});

var ProductList = React.createClass({
	getInitialState:function(){
    return {data:false, loading:false}
  },
  componentWillMount:function(){
    axios.get('/product'+this.props.group+'.json').then((result)=>this.setState({data:result.data}))
  },
	render() {		
		//this.state = this.state || {loading:false}
		this.props.params.item = Number(this.props.params.item) || 1

		if( this.state.data )
			var product_item = this.state.data.map((x,i)=><ProductRow key = {"product_"+i} {...x}/>)
		else{
			var product_item = <div>loading...</div>
		}

		return (
			<div onClick={()=>this.setState({loading:false})}>{product_item}</div>
		)
	}
});
export default ProductList