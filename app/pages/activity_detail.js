import React from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import {Link, browserHistory} from 'react-router'

var ActivityDetail = React.createClass({
	getInitialState(){
    return { article_data: [], activity_detail_data: [] }
  },
  componentWillMount(){
  	axios.get('/api/json/activitys/'+this.props.params.activity_id).then((result)=>axios.get('/api/json/articles/'+result.data.ArticleId).then((result)=>this.setState({ article_data: result.data })))
    axios.get('/api/json/activity_details/'+this.props.params.activity_id).then((result)=>this.setState({ activity_detail_data: result.data[0] }))
  },
  signUp(id){
  	var account = localStorage.account || sessionStorage.account
		var password = localStorage.account || sessionStorage.password

		if( account != null && password != null ) {
			document.getElementById("loading").style.display = "block"
			axios.post("/api/json/signup/activity", {
				account: account,
				password: password,
				activity_detail_id: id
			}).then((response)=>{
				if(response.data.state == true){					
					browserHistory.push('/member/success/1/'+id)
				}
				else{
					browserHistory.push('/member/error/'+response.data.error)
				}
		  }).catch((response)=>{
		  	browserHistory.push('/member/error/'+response.data.error)
		  })
		}		
		else 
			browserHistory.push('/member/signin')
  },
	render(){	
		var content = this.state.article_data.length != 0 ? <ReactMarkdown source={this.state.article_data.article.content} /> : null
		var activity_details = this.state.activity_detail_data.length != 0 ? this.state.activity_detail_data.map((x, y)=>{
  		var button = button = <Link className="btn btn-primary btn-block" style={{"whiteSpace": "normal"}} to="/member/signin">我要報名，<br />立即登入會員</Link>
	  	var account = localStorage.account || sessionStorage.account
			var password = localStorage.account || sessionStorage.password
			if(x.members >= x.number_of_people )
				button = <div className="btn" style={{cursor: "default", color: "#fff", backgroundColor: "#d9534f", borderColor: "#d43f3a", "whiteSpace": "normal"}}>人數已滿</div>
			else if( account != null && password != null )
				button = <div className="btn btn-primary" style={{"whiteSpace": "normal"}} onClick={()=>this.signUp(x.id)}>我要報名</div>

  		return (
  			<div key={"activity_detail_"+y} style={{display: "flex"}}>
  				<div className="table_td_type1" style={{width: "10%"}}>{x.area}</div>
					<div className="table_td_type1" style={{width: "20%"}}>{x.activity_date}</div>
					<div className="table_td_type1" style={{width: "40%"}}>{x.location}</div>
					<div className="table_td_type1" style={{width: "10%"}}><a href={x.google_url} target='_blank'><img width="48px" src='/img/google_map_icon.png' style={{"maxWidth": "100%"}} /></a></div>
					<div className="table_td_type1" style={{width: "20%"}}>{button}</div>
  			</div>
  		)
  	}) : null

		return(
			<div>
				<div>
					{content}
				</div>
				<div style={{backgroundColor: "#ADADAD", color: "#000", textAlign: "center", }}><b>立刻線上報名參加，請先登入會員</b></div>
	  			<div className="html_width_space" style={{margin: "3em auto"}}>
	  				<div style={{color: "#000", borderTop: "#ADADAD 1px solid", borderLeft: "#ADADAD 1px solid"}}>
	  					<div style={{display: "flex", backgroundColor: "#E8E8E8"}}>
		  					<div className="table_td_type1" style={{width: "10%"}}>區域</div>
		  					<div className="table_td_type1" style={{width: "20%"}}>活動日期</div>
		  					<div className="table_td_type1" style={{width: "40%"}}>地點</div>
		  					<div className="table_td_type1" style={{width: "10%"}}>GoogleMap</div>
		  					<div className="table_td_type1" style={{width: "20%"}}>線上報名</div>
		  				</div>
	  					{activity_details}
	  				</div>
	  			</div>
	  			<div id="loading" style={{width: "100%", height: "100%", top: "3em", position: "fixed", textAlign: "center", zIndex: "999", display: "none"}}><img src="/img/loading.gif" width="50px" style={{marginTop: "10em"}} /></div>
			</div>
		)
	}
})
export default ActivityDetail