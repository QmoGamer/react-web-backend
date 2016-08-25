import React from 'react'
import axios from 'axios'
import MediaQuery from 'react-responsive'
import {Link} from 'react-router'
import ReactMarkdown from 'react-markdown'

var FooterPage = React.createClass({
	getInitialState:function(){
    return {data: [], article_data: false}
  },
  componentWillMount:function(){
    axios.get('/api/json/footers/'+this.props.params.footer_id).then((result)=>this.setState({data:result.data}))
  },
  componentWillReceiveProps(nextProps){
  	axios.get('/api/json/footers/'+nextProps.params.footer_id).then((result)=>{
  		this.setState({data: result.data})
  		this.setState({article_data: false})
  	})
  },
  getArticle(id){
  	if(this.state.article_data == false)
  		axios.get('/api/json/articles/'+id).then((result)=>this.setState({article_data:result.data}))
  },
	render(){		  
		var footer_second_menu = null
		if(this.state.data.Footer_Second_Menus != null){
			footer_second_menu =  <div>
															<MediaQuery query='(min-width: 768px)'>
																<ul className="pure-menu-list">
																	{this.state.data.Footer_Second_Menus.map((x,i)=>{
																		if(x.id == this.props.params.footer_second_id)
																			this.getArticle(x.ArticleId)
																		if(x.is_url == 1)
																			return <li key={"li"+i} style={{margin: "0.8em"}}><a href={x.url} style={{color: "#000"}}>{x.name}</a></li>
																		else
																			return <li key={"li"+i} style={{margin: "0.8em"}}><Link to={"/footer_page/"+x.FooterMenuId+"/"+x.id} style={{color: "#000"}}>{x.name}</Link></li>
																	})}
																</ul>
															</MediaQuery>
															<MediaQuery query='(max-width: 767px)'>
																<div>
																	<select className="select_type_1" onChange={(x)=>window.location.href=x.target.value} value={"/footer_page/"+this.props.params.footer_id+"/"+this.props.params.footer_second_id}>
																		{this.state.data.Footer_Second_Menus.map((x,i)=>{
																			if(x.id == this.props.params.footer_second_id)
																				this.getArticle(x.ArticleId)
																			if(x.is_url == 1)
																				return <option key={"option"+i} value={x.url}>{x.name}</option>
																			else
																				return <option key={"option"+i} value={"/footer_page/"+x.FooterMenuId+"/"+x.id} >{x.name}</option>
																		})}
																	</select>
																</div>
															</MediaQuery>				
														</div>
		}	

		var article_content = null
		if(this.state.article_data != null)
			if(this.state.article_data.article != null)
				article_content = <ReactMarkdown source={this.state.article_data.article.content} />

		return (
			<div className="html_width_space pure-g">
				<div className="pure-u-1 pure-u-md-1-8">
					<div className="pure-menu custom-restricted-width" style={{margin: "1em 0em"}}>
						<b><span className="pure-menu-heading" style={{color: "#1082d2", fontSize: "1.5em"}}>{this.state.data.name}</span></b>
						{footer_second_menu}
					</div>
				</div>
				<div className="pure-u-1 pure-u-md-7-8">
					{article_content}
				</div>
			</div>
		)
	}
})
export default FooterPage