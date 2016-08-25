//==========================================
// 加载依赖包，这是 es6 的语法（我好啰嗦）。
import React from 'react'
if (typeof window !== 'undefined') {
    window.React = React;
}
import { render } from 'react-dom'
// 这里从 react-router 引入了三个组件，先不解释。
import { Router, Route, Link, IndexRoute, Redirect, browserHistory } from 'react-router'

import MenuTop from './pages/menu'
import Product from './pages/product'
import ProductItem from './pages/product_item'
import ArticlePage from './pages/article_page'
import Home from './pages/home'
import Foorter from './pages/footer'
import Activity from './pages/activity'
import FooterPage from './pages/footer_page'
import Member from './pages/member'
import Course from './pages/course'
import MemberRegister from './pages/member_register'
import MemberSignIn from './pages/member_signin'
import MemberError from './pages/member_error'
import MemberSuccess from './pages/member_success'
import ActivityDetail from './pages/activity_detail'
import MemberTerms from './pages/member_terms'
import PrivacyPolicy from './pages/privacy_policy'
import OnlineMsg from './pages/online_msg'
import MemberInquire from './pages/member_inquire'

const index = React.createClass({
	componentWillMount(){		
		if((new Date().getTime() - localStorage.time) >= 1000*60*60*24)
			localStorage.clear()
	},
	render(){
		var member_icon = false
		if(localStorage.account != null || sessionStorage.account != null)
			member_icon = true

		return(
			<div>
				<MenuTop group={this.props.params.group} team={this.props.params.team} member={this.props.params.member} signin={member_icon} />
					<div id="page"> 
						{this.props.children}
					</div>
				<Foorter />
			</div>
		)
	}	
})

render((
  	<Router history={browserHistory}>
  		<Route path="/" component={index}>
  			<IndexRoute component={Home} />
  			<Route path="product/:group/" component={Product} />
  			<Route path="product/:group/:team" component={Product} />
      	<Route path="product/:group/:team/:member" component={Product} />
				<Route path="article/:article_id" component={ArticlePage} />
				<Route path="activity/:group" component={Activity} />	
				<Route path="activity/:group/:team" component={Activity} />	
				<Route path="activity/:group/:team/:member" component={Activity} />	
				<Route path="activity/:group/detail/:activity_id" component={ActivityDetail} />
				<Route path="activity/:group/:team/detail/:activity_id" component={ActivityDetail} />
				<Route path="activity/:group/:team/:member/detail/:activity_id" component={ActivityDetail} />
				<Route path="member" component={Member} />
				<Route path="member/success/:success_id" component={MemberSuccess} />
				<Route path="member/success/:success_id/:detail_id" component={MemberSuccess} />
				<Route path="member/error/:error_id" component={MemberError} />
				<Route path="member/register" component={MemberRegister} />
				<Route path="member/signin" component={MemberSignIn} />
				<Route path="member_terms" component={MemberTerms} />
				<Route path="member/inquire" component={MemberInquire} />
				<Route path="privacy_policy" component={PrivacyPolicy} />
				<Route path="course/:group/" component={Course} />
				<Route path="course/:group/:team" component={Course} />		
				<Route path="course/:group/:team/:member" component={Course} />		
				<Route path="footer_page/:footer_id/:footer_second_id" component={FooterPage} />
				<Route path="online_msg" component={OnlineMsg} />
	    </Route>
  	</Router>
), document.getElementById('root'));