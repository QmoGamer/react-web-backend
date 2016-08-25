import React from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

var ArticleContent = React.createClass({
	getInitialState(){
    return {data: false}
  },
  componentWillMount(){
  	axios.get('/api/json/articles/'+this.props.member).then((result)=>{
  		if(result.data.article != null)
  			if(result.data.article.content != null)
  				this.setState({data:result.data.article.content})
  	})
    // axios.get('/api/json/menus/'+this.props.member).then((result)=>axios.get('/api/json/articles/'+result.data.ArticleId).then((result)=>this.setState({data:result.data.article.content})))
  },
  componentWillReceiveProps(nextProps){
  	axios.get('/api/json/articles/'+this.props.member).then((result)=>{
  		if(result.data.article != null)
  			if(result.data.article.content != null)
  				this.setState({data:result.data.article.content})
  	})
  	//axios.get('/api/json/articles/'+this.props.member).then((result)=>this.setState({data:result.data.article.content}))
  	// axios.get('/api/json/menus/'+nextProps.member).then((result)=>axios.get('/api/json/articles/'+result.data.ArticleId).then((result)=>this.setState({data:result.data.article.content})))
  },
	render() {
		var content = this.state.data ? <ReactMarkdown source={ this.state.data } /> : ""
		return (
			<div>
				{ content }
			</div>
		)
	}
})
export default ArticleContent