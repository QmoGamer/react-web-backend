import React from 'react'
import axios from 'axios'
import { Link } from 'react-router'

var OnlineMsg = React.createClass({
	formSubmit(){	
		for(var i = 0; i < document.getElementsByClassName("valid_field").length; i++)
			document.getElementsByClassName("valid_field")[i].innerHTML=""

		if( this.refs.name.value.trim() == false ) {
			document.getElementById("valid_name").innerHTML = "*欄位不得為空"
			this.refs.name.focus()
		}
		else if( this.refs.phone.value.trim() == false ) {
			document.getElementById("valid_phone").innerHTML = "*欄位不得為空"
			this.refs.phone.focus()
		}
		else if( this.validateEmail(this.refs.email.value ) == false ) {
			document.getElementById("valid_email").innerHTML = "*信箱格式錯誤"
			this.refs.email.focus()
		}
		else if( this.refs.msg.value.trim() == false ) {
			document.getElementById("valid_msg").innerHTML = "*欄位不得為空"
			this.refs.msg.focus()
		}
		else {
			var text = "聯絡目的: <font size='4' color='#4285f4'><b>"
			if( this.refs.option_1.checked == true )
				text += " 舊版升級 "
			if( this.refs.option_2.checked == true )
				text += " 產品訂購 "
			if( this.refs.option_3.checked == true )
				text += " 活動諮詢 "
			if( this.refs.option_4.checked == true )
				text += " 促銷專案 "
			if( this.refs.option_5.checked == true )
				text += " 課程諮詢 "
			if( this.refs.option_6.checked == true )
				text += " 活動或課程會後訪談 "
			if( this.refs.option_7.checked == true )
				text += " 技術服務 "
			if( this.refs.option_8.checked == true )
				text += " 其他 "
			text += "</b></font>"

			text += "<br /><br />公司名稱: "+this.refs.phone.value
			text += "<br /><br />姓名: "+this.refs.name.value
			text += "<br /><br />電話: "+this.refs.phone.value
			text += "<br /><br />E-mail: "+this.refs.email.value
			text += "<br /><br />留言內容: "+this.refs.msg.value
			text += "<br /><br />是否曾向大塚購買過產品或服務: "
			text += this.refs.is_buy_1.checked == true ? "是" : "否" 

			axios.post("/api/json/online_msg", {
				account: this.refs.email.value,
				text: text,
			}).then((response)=>{
				if(response.data.state == true){				
					document.getElementById("mail_form").style.display = "none"
					document.getElementById("send_success").style.display = "block"							
				}
				else if(response.data.state == false){
					document.getElementById("mail_form").style.display = "none"
					document.getElementById("send_fail").style.display = "block"	
				}
		  }).catch((response)=>{
		  	document.getElementById("mail_form").style.display = "none"
				document.getElementById("send_fail").style.display = "block"	
		  })
		}
	},
	validateEmail(value) {
    var re = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
    return re.test(value)
  },
	render(){
		return(
			<div>
				<img src="/upload/img-45-ca51b4c0.jpg" width="100%" height="100%" />
				<h2 style={{color: "#03596B", textAlign: "center", margin: "1.5em 0 1em 0"}}>線上留言</h2>
				<hr size="1" width="90%" />
				<div id="mail_form" className="terms">
		      <h4>親愛的客戶，您好：</h4>
		      <div>感謝您透過本公司網站留言，您的留由將由「大塚客服中心」為優先服務單位，再進一步了解您的問題或需求後與內部相關單位進行連繫處理，預計將於1~3個工作天回覆您。</div>
		      <h4 style={{color: "red"}}>您也可直接來電：大塚客服中心 02-8964-6668 轉 4 (客服部)</h4>
		      <form>
		        <h4>聯絡目的</h4>
		        <div>
		          <input type="checkbox" ref="option_1" name="option" id="option_1" style={{margin: "4px"}} /><label htmlFor="option_1">舊版升級</label>
		          
		          <input type="checkbox" ref="option_2" name="option" id="option_2" style={{margin: "4px"}} /><label htmlFor="option_2">產品訂購</label>
		         
		          <input type="checkbox" ref="option_3" name="option" id="option_3" style={{margin: "4px"}} /><label htmlFor="option_3">活動諮詢</label>
		         
		          <input type="checkbox" ref="option_4" name="option" id="option_4" style={{margin: "4px"}} /><label htmlFor="option_4">促銷專案</label>
		       
		          <br />
		          <input type="checkbox" ref="option_5" name="option" id="option_5" style={{margin: "4px"}} /><label htmlFor="option_5">課程諮詢</label>
		        
		          <input type="checkbox" ref="option_6" name="option" id="option_6" style={{margin: "4px"}} /><label htmlFor="option_6">活動或課程會後訪談</label>
		         
		          <input type="checkbox" ref="option_7" name="option" id="option_7" style={{margin: "4px"}} /><label htmlFor="option_7">技術服務</label>
		      
		          <input type="checkbox" ref="option_8" name="option" id="option_8" style={{margin: "4px"}} /><label htmlFor="option_8">其他</label>
		       
		        </div>
		        <h4>公司/單位名稱</h4>
		        <div>
		          <input type="text" ref="company_name" name="company_name" id="company_name" className="form-control" />
		        </div>
		        <h4>姓名</h4>
		        <div>
		          <input type="text" ref="name" name="name" id="name" className="form-control" />
		          <div id="valid_name" className="valid_field"></div>
		        </div>
		        <h4>聯絡電話</h4>
		        <div>
		          <input type="text" ref="phone" name="phone" id="phone" className="form-control" />
		          <div id="valid_phone" className="valid_field"></div>
		        </div>
		        <h4>E-mail</h4>
		        <div>
		          <input type="text" ref="email" name="email" id="email" className="form-control" />
		          <div id="valid_email" className="valid_field"></div>
		        </div>
		        <h4>其他留言</h4>
		        <div>
		          <textarea ref="msg" name="msg" id="msg" cols="60" rows="10" className="form-control"></textarea>
		          <div id="valid_msg" className="valid_field"></div>
		        </div>
		        <h4>是否曾向大塚購買過產品或服務</h4>
		        <div>
		          <input type="radio" ref="is_buy_1" name="is_buy" id="is_buy_1" style={{margin: "4px"}} /><label htmlFor="is_buy_1">是</label>
		          <input type="radio" ref="is_buy_0" name="is_buy" id="is_buy_0" style={{margin: "4px"}} defaultChecked /><label htmlFor="is_buy_0">否</label>
		        </div>
		        <br />
		        <button type="button" className="btn btn-primary" style={{marginRight: "1em"}} onClick={()=>this.formSubmit()} >確認送出</button>
		        <button type="reset" className="btn btn-default">重新填寫</button>
		      </form>
		    </div>
		    <div id="send_success" className="terms" style={{display: "none", textAlign: "center"}}>
		    	<div>
		    		Hello您好! 您的留言我們已收到
		    	<br />
		    		預計將在工作日1~3天內 
		    	<br />
		    		再與您回覆或電話聯絡!
		    	<br />
		    	<br />
		    		  謝謝您給予我們服務的機會!
		    	<br />
		    	<br />
		    		  大塚∣客服中心 oitcsub@oitc.com.tw  
		    	<br />
		    	<br />
		    		<Link to="/" className="btn btn-info">回大塚官網首頁</Link>
		    	<br />
		    	</div>
		    </div>
		    <div id="send_fail" className="terms" style={{display: "none"}}>
		    	<h4>親愛的客戶，您好：</h4>
		      <div>系統發生問題，目前無法留言，<font color="red">請您直接來電：大塚客服中心 02-8964-6668 分機 4</font></div>
		    </div>
			</div>
		)
	}
})
export default OnlineMsg