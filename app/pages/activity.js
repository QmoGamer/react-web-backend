import React from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router'
import MediaQuery from 'react-responsive'

var Activity = React.createClass({
	getInitialState(){
    return {data:[]}
  },
  componentWillMount(){
  	var id = this.props.params.member || this.props.params.team || this.props.params.group
  	this.getActivity(id)
  },
  componentWillReceiveProps(nextProps){
  	var id = nextProps.params.member || nextProps.params.team || nextProps.params.group
  	this.getActivity(id)
  },
  getActivity(id){
  	axios.get('/api/json/activity_list/'+id).then((result)=>this.setState({data:result.data}))
  },
	render(){	
		var banner = null
		if( this.state.data.length != 0 ) {
			var path = "/activity/"
			if(this.props.params.group != null)
				path += this.props.params.group+"/"
			if(this.props.params.team != null)
				path += this.props.params.team+"/"
			if(this.props.params.member != null)
				path += this.props.params.member+"/"

			banner = this.state.data.map((x, y)=> {
				return (
					<div key={"banner_"+y} style={{position: "relative", margin: "1em 0"}}>
						<Link to={path+"detail/"+x.id}>
							<MediaQuery query='(min-width: 768px)'>
	  							<img className="bg_img" src={x.Banner.img} />
	  					</MediaQuery>
	  					<MediaQuery query='(max-width: 767px)'>
	  							<img className="bg_img" src={x.Banner.mobile_img} />
	  					</MediaQuery>
						</Link>
						<div className="banner_text" style={{top: x.Banner.text_top+"%", left: x.Banner.text_left+"%"}}>
							<Link to={path+"detail/"+x.id}>
								<ReactMarkdown source={x.Banner.text} />
							</Link>
						</div>
					</div>
				)
			})
		}

		return <div>{banner}</div>
	}
})
export default Activity