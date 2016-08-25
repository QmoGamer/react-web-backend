import React from 'react'
import {Link, browserHistory} from 'react-router'

var MemberError = React.createClass({
	render(){
		var error_msg = "狀態異常，請聯絡相關人員，謝謝。"
		switch(this.props.params.error_id){
			case "1":
				error_msg = "登入失敗，請檢查您的帳號與密碼是否有誤，謝謝。"
				break;
			case "2":
				error_msg = "更新失敗，請聯絡相關人員，謝謝。"
				break;
			case "3":
				error_msg = "註冊失敗，請聯絡相關人員，謝謝。"
				break;
			case "4":
				error_msg = "變更失敗，請聯絡相關人員，謝謝。"
				break;
			case "5":
				error_msg = "舊密碼有誤，請重新輸入，謝謝。"
				break;
			case "6":
				error_msg = "新密碼不相同，請重新輸入，謝謝。"
				break;
			case "7":
				error_msg = "帳號有誤，請重新輸入，謝謝。"
				break;
			case "8":
				error_msg = "密碼格式不符，請重新輸入，謝謝。"
				break;			
			case "11":
				error_msg = "您已報名過此課程 !"
				break;
			case "12":
				error_msg = "報名人數已滿 !"
				break;
			case "99":
				error_msg = "伺服器異常，請聯絡相關人員，謝謝。"
				break;
		}

		return(
			<div style={{margin: "2em 0", textAlign: "center"}}>
				{error_msg}
				<br />
				<br />
				<Link to="/member" className="btn btn-info">返回會員專區</Link>
			</div>
		)
	}
})
export default MemberError