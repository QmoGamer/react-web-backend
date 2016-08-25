import React from 'react'
import axios from 'axios'
import MediaQuery from 'react-responsive'
import ReactMarkdown from 'react-markdown'

//====================
var Banner = React.createClass({
	render(){		  	
		return (
			<div style={{position: "relative"}}>			
				<MediaQuery query='(min-width: 768px)'>
					<img src={this.props.img} className="bg_img" />
				</MediaQuery>
				<MediaQuery query='(max-width: 767px)'>
					<img src={this.props.mobile_img} className="bg_img" />
				</MediaQuery>	
				<div className="banner_text" style={{top: this.props.text_top+"%", left: this.props.text_left+"%"}}>
					<ReactMarkdown source={this.props.text} />
				</div>
			</div>
		)
	}
})
export default Banner