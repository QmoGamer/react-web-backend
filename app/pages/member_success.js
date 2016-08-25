import React from 'react'
import {Link, browserHistory} from 'react-router'
import axios from 'axios'

var MemberSuccess = React.createClass({
	getInitialState(){
    return { data: [] }
  },
	componentDidMount() {
		if (this.props.params.success_id == 1) { 
			axios.get('/api/json/activity_details/detail/'+this.props.params.detail_id).then((result)=>this.setState({ data: result.data }))
		}
		else if (this.props.params.success_id == 2) {
			axios.get('/api/json/course_details/detail/'+this.props.params.detail_id).then((result)=>this.setState({ data: result.data }))
		}
	},
	render(){
		var success_msg = "狀態異常，請聯絡相關人員，謝謝。"
		switch(this.props.params.success_id){
			case "1":
				success_msg = [
												<div key={0}>歡迎<span key={9} className="blue_font_type">{( sessionStorage.nickname || localStorage.nickname )}</span>即將參加</div>,
												<div key={1} className="blue_font_type">{this.state.data.name}</div>,
												<div key={2}>我們已發送活動詳細資訊到您的e-mail信箱</div>,
												<div key={3}>貼心提醒您，請將</div>,
												<div key={4} className="blue_font_type">{this.state.data.activity_date}</div>,
												<div key={5}>的時間記錄在您的行事曆中</div>,
												<div key={6}>若活動資訊有任時變更</div>,
												<div key={7}>我們將再另行通知。</div>,
												<br key={10} />,
												<div key={8}>大塚∣行銷促進部 mktservice@oitc.com.tw</div>
											]
				break;
			case "2":
				success_msg = [
												<div key={0}>歡迎<span key={9} className="blue_font_type">{( sessionStorage.nickname || localStorage.nickname )}</span>即將參加</div>,
												<div key={1} className="blue_font_type">{this.state.data.name}</div>,
												<div key={2}>我們已發送課程詳細資訊到您的e-mail信箱</div>,
												<div key={3}>貼心提醒您，請將</div>,
												<div key={4} className="blue_font_type">{this.state.data.course_date}</div>,
												<div key={5}>的時間記錄在您的行事曆中</div>,
												<div key={6}>若活動資訊有任時變更</div>,
												<div key={7}>我們將再另行通知。</div>,
												<br key={10} />,
												<div key={8}>大塚∣行銷促進部 mktservice@oitc.com.tw</div>
											]
				break;
			case "3":
				success_msg = "密碼變更成功 !"
				break;
			case "4":
				success_msg = [
												<div key={0}>親愛的會員您好，我們已經將密碼資訊寄到下列信箱</div>,
												<div key={1} className="blue_font_type">{ sessionStorage.temp_account }</div>,
												<div key={2}>請您到信箱收取確認信件</div>,
												<div key={3}>並且透過信箱連結</div>,
												<div key={4}>重新設定您的密碼</div>,
												<br key={7} />,
												<div key={5}>謝謝！</div>,
												<br key={8} />,
												<div key={6}>大塚∣客服中心 help@oitc.com.tw</div>
											]
				break;
			case "5":
				success_msg = [
												<div key={1}>歡迎 ~ {sessionStorage.temp_nickname} ~</div>,
												<br key={8} />,
												<div key={2}>加入大塚官網會員 !!!</div>,
												<br key={9} />,
												<br key={10} />,
												<div key={3}>我們已發送加入會員通知e-mail到下列信箱</div>,
												<div key={4} style={{color: "#4285f4"}}>{sessionStorage.temp_account}</div>,
												<br key={11} />,
												<div key={5}>您現在可以使用e-mail帳號或下列手機號碼</div>,
												<div key={6} style={{color: "#4285f4"}}>{sessionStorage.temp_phone}</div>,
												<div key={7}>的方式登入會員，即可使用活動或課程的報名喔！</div>
											]

		}

		return(
			<div style={{margin: "2em 0", textAlign: "center"}}>
				{success_msg}
				<br />
				<br />
				<Link to="/member" className="btn btn-info">返回會員專區</Link>
			</div>
		)
	}
})
export default MemberSuccess