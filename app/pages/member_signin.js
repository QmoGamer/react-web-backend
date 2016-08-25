import React from 'react'
import axios from 'axios'
import {Link, browserHistory} from 'react-router'

var MemberSignIn = React.createClass({
	formSubmit(){		
		axios.post("/api/json/member/login", {
			account: this.refs.account.value,
			password: this.refs.password.value			
		}).then((response)=>{
			if(response.data.state == true){
				// 清除temp資訊
				sessionStorage.clear()
				if(this.refs.remember.checked == true) {
					localStorage.setItem("nickname", response.data.nickname)
					localStorage.setItem("account", response.data.account)
					localStorage.setItem("password", response.data.password)
				}
				else {
					sessionStorage.setItem("nickname", response.data.nickname)
					sessionStorage.setItem("account", response.data.account)
					sessionStorage.setItem("password", response.data.password)
				}
				browserHistory.push("/member")
			}
			else{
				browserHistory.push('/member/error/'+response.data.error)
			}
	  }).catch((response)=>{
	  	browserHistory.push('/member/error/'+response.data.error)
	  })
	},
	render(){
		return(
			<div style={{margin: "2em 0", textAlign: "center"}}>
				<div className="form_member">
					<div>
						<input type="text" ref="account" className="form-control" placeholder="請輸入電子郵件" />
					</div>
					<div>
						<input type="password" ref="password" className="form-control" placeholder="請輸入密碼" />
					</div>
					<div>
						<input type="checkbox" ref="remember" id="keep_login" style={{margin: "0 0.5em 0 0", verticalAlign: "middle"}} /><label htmlFor="keep_login" style={{cursor: "pointer"}}>讓我保持登入</label>
					</div>
					<div>
						<input type="button" className="btn btn-primary btn-block" style={{width: "100%"}} value="登入" onClick={this.formSubmit} />
					</div>
				</div>
				<div style={{marginTop: "1em"}}>
					您還不是會員嗎? <Link to="/member/register" style={{color: "red"}}>立即加入</Link>
				</div>
				<div style={{margin: "1em"}}>
					<Link to="/member/inquire">忘了密碼?</Link>
				</div>
			</div>
		)
	}
})
export default MemberSignIn