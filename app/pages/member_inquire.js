import React from 'react'
import axios from 'axios'
import { browserHistory } from 'react-router'

var MemberInquire = React.createClass({
	formSubmit(){
		document.getElementById("valid_email").innerHTML = ""
		// var password = localStorage.password || sessionStorage.password

		if( this.validateEmail(this.refs.account.value) == false ) {
			document.getElementById("valid_email").innerHTML = "*信箱格式錯誤"
			this.refs.account.focus()
		}
		else {
			document.getElementById("loading").style.display = "block"
			axios.post("/api/json/member/inquire_ps", {
				account: this.refs.account.value
				// password: password
			}).then((response)=>{
				if(response.data.state == true){
					sessionStorage.clear()
					localStorage.clear()
					sessionStorage.setItem("temp_account", this.refs.account.value)
					browserHistory.push('/member/success/4')
				}
				else{
					browserHistory.push('/member/error/'+response.data.error)
				}
		  }).catch((response)=>{
		  	browserHistory.push('/member/error/'+response.data.error)
		  })
		}	
	},
	validateEmail(value) {
    var re = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
    return re.test(value)
  },
	render(){
		return(
			<div className="form_member">
				<div style={{textAlign: "center", color: "#000"}}>查詢密碼</div>
				<div>
					<input type="text" ref="account" className="form-control" placeholder="請輸入email帳號" />
					<div id="valid_email" className="valid_field"></div>
				</div>
				<div>
					<a href="#" data-toggle="tab" className="btn btn-primary btn-block" onClick={this.formSubmit}>送出查詢</a>
				</div>
				<div id="loading" style={{width: "100%", height: "100%", top: "2em", position: "fixed", textAlign: "center", display: "none"}}><img src="/img/loading.gif" width="50px" style={{marginTop: "5em"}} /></div>
				<br />
				<br />
			</div>
		)		
	}
})
export default MemberInquire