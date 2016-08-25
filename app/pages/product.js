import React from 'react'
import MediaQuery from 'react-responsive'
import {Link} from 'react-router'
import ProductItem from './product_item'
//var Waypoint = require('react-waypoint');
//var PropTypes = React.PropTypes;
import axios from 'axios'
import Banner from './banner'
import Article from './article'
import ArticleAnchor from './article_anchor'

var ProductHeader = React.createClass({
  getInitialState:function(){
    return {data:false, needs_fix:false, banner: [], threshold: 0, article_id: 0}
  },
  componentWillMount(){
  	this.getBanner(this.props.params.member||this.props.params.team)
  },
  componentWillReceiveProps(nextProps){
		this.getBanner(nextProps.params.member||nextProps.params.team)
  },  
  getBanner(id){
  	axios.get('/api/json/menus/'+id).then((result)=>{
  		if(result.data.BannerId != null)
  			axios.get('/api/json/banners/'+result.data.BannerId).then((result)=>this.setState({banner: result.data}))
  		if(result.data.ArticleId != null)
  			this.setState({article_id: result.data.ArticleId})
  	})
  },
	render() {
		window.waypointer = this.refs.waypoint
		var id = this.props.params.member||this.props.params.team

		if( this.props.params.team == null ) {
			var top = "4.5em"
			var threshold = -0.08
		}
		else if( this.props.params.member == null ) {
			var top = "6em"
			var threshold = -0.10
		}
		else {
			var top = "7.5em"
			var threshold = -0.12
		}

		var banner = null		
		if(this.state.banner.length != 0)
			banner = <Banner img={this.state.banner.img} mobile_img={this.state.banner.mobile_img} text={this.state.banner.text} text_top={this.state.banner.text_top} text_left={this.state.banner.text_left} />
		
		return (
			<div>
				<div>
					{banner}
				</div>
				<div>	  
	      	<MediaQuery query='(min-width: 768px)'>
					  <ArticleAnchor ref='waypoint' threshold={threshold} top={top} member={id} />   
	        </MediaQuery>
		    </div>
		    <div>		    	
					<Article member={this.state.article_id} />
				</div>
			</div>
		);
	}
});
export default ProductHeader