import React from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import {Link, browserHistory} from 'react-router'

var Course = React.createClass({
	getInitialState(){
    return {article_data: [], course_data: [], course_detail_data: [], count_array: []}
  },
  componentWillMount(){
  	var id = this.props.params.member || this.props.params.team || this.props.params.group
  	axios.get('/api/json/menus/'+id).then((result)=>axios.get('/api/json/courses/'+result.data.CourseId).then((result)=>{
			this.setState({ course_data: result.data })
			axios.get('/api/json/articles/'+result.data.ArticleId).then((result)=>this.setState({ article_data: result.data }))
			axios.get('/api/json/course_details/'+result.data.id).then((result)=>this.setState({ course_detail_data: result.data[0] }))
  	}))
  },
  componentWillReceiveProps(nextProps){
  	var id = nextProps.params.member || nextProps.params.team || nextProps.params.group
  	axios.get('/api/json/menus/'+id).then((result)=>axios.get('/api/json/courses/'+result.data.CourseId).then((result)=>{
			this.setState({ course_data: result.data })
			axios.get('/api/json/articles/'+result.data.ArticleId).then((result)=>this.setState({ article_data: result.data }))
			axios.get('/api/json/course_details/'+result.data.id).then((result)=>this.setState({ course_detail_data: result.data[0] }))
  	}))
  },
  signUp(id){
  	var account = localStorage.account || sessionStorage.account
		var password = localStorage.account || sessionStorage.password

		if( account != null && password != null ) {
			document.getElementById("loading").style.display = "block"
			axios.post("/api/json/signup/course", {
				account: account,
				password: password,
				course_detail_id: id
			}).then((response)=>{
				if(response.data.state == true){
					browserHistory.push('/member/success/2/'+id)
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
  	var article = this.state.article_data.length != 0 ? <ReactMarkdown source={this.state.article_data.article.content} /> : null
  	var course_details = this.state.course_detail_data.length != 0 ? this.state.course_detail_data.map((x, y)=>{
  		var button = button = <Link className="btn btn-primary btn-block" style={{"whiteSpace": "normal"}} to="/member/signin">我要報名，<br />立即登入會員</Link>
	  	var account = localStorage.account || sessionStorage.account
			var password = localStorage.account || sessionStorage.password
			if(x.members >= x.number_of_people )
				button = <div className="btn" style={{cursor: "default", color: "#fff", backgroundColor: "#d9534f", borderColor: "#d43f3a", "whiteSpace": "normal"}}>人數已滿</div>
			else if( account != null && password != null )
				button = <div className="btn btn-primary" style={{"whiteSpace": "normal"}} onClick={()=>this.signUp(x.id)}>我要報名</div>

  		return (
  			<div key={"course_detail_"+y} style={{display: "flex"}}>
  				<div className="table_td_type1" style={{width: "10%"}}>{x.area}</div>
  				<div className="table_td_type1" style={{width: "25%"}}>{x.name}</div>
					<div className="table_td_type1" style={{width: "20%"}}>{x.course_date}</div>
					<div className="table_td_type1" style={{width: "20%"}}>{x.course_time}</div>
					<div className="table_td_type1" style={{width: "10%"}}><a href={x.google_url} target='_blank'><img width="48px" src='/img/google_map_icon.png' style={{"maxWidth": "100%"}} /></a></div>
					<div className="table_td_type1" style={{width: "10%"}}>{(x.number_of_people-x.members)}</div>
					<div className="table_td_type1" style={{width: "15%"}}>{button}</div>
  			</div>
  		)
  	}) : null

  	return(
  		<div>
  			<div>
  				{article}
  			</div>
  			<div style={{backgroundColor: "#ADADAD", color: "#000", textAlign: "center", }}><b>立刻線上報名參加，請先登入會員</b></div>
  			<div className="html_width_space" style={{margin: "3em auto"}}>
  				<div style={{color: "#000", borderTop: "#ADADAD 1px solid", borderLeft: "#ADADAD 1px solid"}}>
  					<div style={{display: "flex", backgroundColor: "#E8E8E8"}}>
	  					<div className="table_td_type1" style={{width: "10%"}}>區域</div>
	  					<div className="table_td_type1" style={{width: "25%"}}>班別</div>
	  					<div className="table_td_type1" style={{width: "20%"}}>上課日期</div>
	  					<div className="table_td_type1" style={{width: "20%"}}>時段</div>
	  					<div className="table_td_type1" style={{width: "10%"}}>GoogleMap</div>
	  					<div className="table_td_type1" style={{width: "10%"}}>剩餘人數</div>
	  					<div className="table_td_type1" style={{width: "15%"}}>線上報名</div>
	  				</div>
  					{course_details}
  				</div>
  			</div>
  			<div id="loading" style={{width: "100%", height: "100%", top: "3em", position: "fixed", textAlign: "center", zIndex: "999", display: "none"}}><img src="/img/loading.gif" width="50px" style={{marginTop: "10em"}} /></div>
  		</div>
  	)
  }
})
export default Course