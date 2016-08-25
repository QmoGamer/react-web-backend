import React from 'react'
import axios from 'axios'
import {Link, browserHistory} from 'react-router'

var MemberIndex = React.createClass({
	render(){
		return(
			<div style={{textAlign: "center", margin: "3em auto"}}>
				<h3>親愛的 {sessionStorage.nickname || localStorage.nickname} 您好 ! <br />您現在可以使用會員的相關服務，以及活動與課程的報名 !</h3>
			</div>
		)
	}
})

var MemberEdit = React.createClass({
	getInitialState(){
    return { city_data: [], area_data: [], industry_data1: [], industry_data2: [], industry_data3: [], institution_data: [], city: this.props.data.company_city, area: this.props.data.company_area, type1: this.props.data.company_type1, type2: this.props.data.company_type2, type3: this.props.data.company_type3 }
  },
	componentWillMount(){
		axios.get('/api/json/city_data').then((result)=>this.setState({ city_data: result.data }))
		axios.get('/api/json/area_data/'+this.props.data.company_city).then((result)=>this.setState({ area_data: result.data }))
		axios.get('/api/json/industry_data/0').then((result)=>this.setState({ industry_data1: result.data }))
		axios.get('/api/json/industry_data/'+this.props.data.company_type1).then((result)=>this.setState({ industry_data2: result.data }))
		axios.get('/api/json/industry_data/'+this.props.data.company_type2).then((result)=>this.setState({ industry_data3: result.data }))
		axios.get('/api/json/institution_data').then((result)=>this.setState({ institution_data: result.data }))
	},
	formSubmit(){
		var account = localStorage.account || sessionStorage.account
		var password = localStorage.password || sessionStorage.password

		if( account != null && password != null ) {
			axios.post("/api/json/member/update", {
				account: account,
				password: password,
				phone: this.refs.phone.value,
				birthday: this.refs.birthday.value,
				name: this.refs.name.value,
				nickname: this.refs.nickname.value,
				company_name: this.refs.company_name.value,
				company_id: "",
				company_city: this.refs.company_city.value,
				company_area: this.refs.company_area.value,			
				company_address: this.refs.company_address.value,
				company_phone: this.refs.company_phone.value,
				department: this.refs.department.value,
				job_title: this.refs.job_title.value,
				company_type1: this.refs.company_type1.value,
				company_type2: this.refs.company_type2.value,
				company_type3: this.refs.company_type3.value,
				institution: this.refs.institution.value,
				is_enews: this.refs.enews_1.checked ? this.refs.enews_1.value : this.refs.enews_0.value,
				reference: this.refs.reference.value
			}).then((response)=>{
				if(response.data.state == true){
					document.getElementById("tab_3").className = ""					
				}
				else{
					browserHistory.push('/member/error/'+response.data.error)
				}
		  }).catch((response)=>{
		  	browserHistory.push('/member/error/'+response.data.error)
		  })
		}
	},
	getArea(x){
		var x_value = x.target.value
		axios.get('/api/json/area_data/'+x_value).then((result)=>this.setState({ area_data: result.data, city: x_value, area: 0 }))
	},
	setArea(){
		return this.state.area_data.map((x, y)=><option key={"area_"+y} value={x.id}>{x.Area}</option>)
	},
	getIndustry2(x){
		var x_value = x.target.value
		if(x_value != 0)
			axios.get('/api/json/industry_data/'+x.target.value).then((result)=>this.setState({ industry_data2: result.data, industry_data3: [], type1: x_value, type2: 0, type3: 0 }))
		else
			this.setState({ industry_data2: [], industry_data3: [], type1: x_value, type2: 0, type3: 0 })
	},
	setIndustry2(){
		return this.state.industry_data2.map((x, y)=><option key={"industry_data2_"+y} value={x.id}>{x.option}</option>)
	},
	getIndustry3(x){
		var x_value = x.target.value
		if(x_value != 0)
			axios.get('/api/json/industry_data/'+x.target.value).then((result)=>this.setState({ industry_data3: result.data, type2: x_value, type3: 0 }))
		else
			this.setState({ industry_data3: [], type2: x_value, type3: 0 })
	},
	setIndustry3(){
		return this.state.industry_data3.map((x, y)=><option key={"industry_data3_"+y} value={x.id}>{x.option}</option>)
	},
	render() {
		return (
			<div style={{margin: "2em 0"}}>
				<div className="form_member">
					<div>帳號 : {this.props.data.email}</div>
					<div className="form-group input-group">
						<span className="input-group-addon">手機號碼</span>
						<input type="text" ref="phone" name="phone" className="form-control" defaultValue={this.props.data.phone} placeholder="請輸入您的手機號碼" />
					</div>
					<p className="help-block">*此手機號碼，也為登入會員的帳號，也是日後收取相關會員活動簡訊之門號</p>										
					<div className="form-group input-group">
						<span className="input-group-addon">生日</span>
						<input type="date" ref="birthday" name="birthday" className="form-control" defaultValue={this.props.data.birthday} placeholder="請輸入您的生日" />						
					</div>					
					<p className="help-block">*格式19800101</p>
					<div className="form-group input-group">
						<span className="input-group-addon">中文名</span>
						<input type="text" ref="name" name="name" className="form-control" defaultValue={this.props.data.name} placeholder="請輸入您的中文全名" />
					</div>
					<div className="form-group input-group">
						<span className="input-group-addon">英文名/暱稱</span>
						<input type="text" ref="nickname" name="nickname" className="form-control" defaultValue={this.props.data.nickname} placeholder="請輸入您的英文名或暱稱" />
					</div>
					<h6 style={{borderTop: "1px #000 solid", marginTop: "2em"}}></h6>
					<div>工作資料</div>
					<div>
						<input type="text" ref="company_name" name="company_name" className="form-control" defaultValue={this.props.data.company_name} placeholder="請輸入公司名稱" />
						<p className="help-block">*個人單位免填</p>
					</div>
					<div>
						<select className="form-control" name="institution" ref="institution" defaultValue={this.props.data.institution}>
							{	this.state.institution_data.map((x, y)=><option key={"institution_"+y} value={x.id}>{x.option}</option>) }
						</select>
					</div>
					<div>
						<select ref="company_type1" name="company_type1" className="form-control" value={this.state.type1} onChange={this.getIndustry2}>
							<option value="0">請選擇公司產業類別1</option>
							{ this.state.industry_data1.map((x, y)=><option key={"industry_data1_"+y} value={x.id}>{x.option}</option>) }
						</select>
					</div>
					<div>
						<select ref="company_type2" name="company_type2" className="form-control" value={this.state.industry_data2.length != 0 ? this.state.type2 : 0} onChange={this.getIndustry3}>
							<option value="0">請選擇公司產業類別2</option>
							{	this.setIndustry2() }
						</select>
					</div>
					<div>
						<select ref="company_type3" name="company_type3" className="form-control" value={this.state.industry_data3.length != 0 ? this.state.type3 : 0} onChange={(x)=>this.setState({ type3: x.target.value })}>
							<option value="0">請選擇公司產業類別3</option>
							{	this.setIndustry3() }
						</select>
					</div>
					<div className="form-group input-group">
						<span className="input-group-addon">部門名稱</span>
						<input type="text" ref="department" name="department" className="form-control" defaultValue={this.props.data.department} placeholder="請輸入部門名稱" />
					</div>
					<div className="form-group input-group">
						<span className="input-group-addon">職稱</span>
						<input type="text" ref="job_title" name="job_title" className="form-control" defaultValue={this.props.data.job_title} placeholder="請輸入您的職稱" />
					</div>
					<h6 style={{borderTop: "1px #000 solid", marginTop: "2em"}}></h6>
					<div>通訊資料</div>
					{/*<div>
						<input type="text" ref="company_id" name="company_id" className="form-control" defaultValue={this.props.data.company_id} placeholder="請輸入公司統編" />						
					</div>*/}
					<div>
						<select ref="company_city" name="company_city" className="form-control" value={this.state.city} onChange={this.getArea}>
							{	this.state.city_data.map((x, y)=><option key={"city_"+y} value={x.id}>{x.City}</option>) }
						</select>
					</div>
					<div>
						<select ref="company_area" name="company_area" className="form-control" value={this.state.area_data.length != 0 ? this.state.area : 0} onChange={(x)=>this.setState({ area: x.target.value })}>
							{	this.setArea() }
						</select>
					</div>
					<div>
						<input type="text" ref="company_address" name="company_address" className="form-control" defaultValue={this.props.data.company_address} placeholder="請輸入地址" />
					</div>
					<div className="form-group input-group">
						<span className="input-group-addon">辦公電話</span>
						<input type="text" ref="company_phone" name="company_phone" className="form-control" defaultValue={this.props.data.company_phone} placeholder="請輸入您的辦公室電話" />
					</div>
					<div className="form-group input-group">
						<span className="input-group-addon">推薦人</span>
						<input type="text" ref="reference" name="reference" className="form-control" defaultValue={this.props.data.reference} placeholder="請輸入您的推薦人" />
					</div>
					<h6 style={{borderTop: "1px #000 solid", marginTop: "2em"}}></h6>					
					<div>是否願意收到大塚電子報及活動訊息通知</div>
					<div>
						<input type="radio" ref="enews_1" name="enews" id="enews_1" value="1" defaultChecked={this.props.data.is_enews == 1 ? "true" : null } style={{margin: "0 0.5em 0 0", verticalAlign: "middle"}} /><label htmlFor="enews_1">願意</label>
					</div>
					<div>
						<input type="radio" ref="enews_0" name="enews" id="enews_0" value="0" defaultChecked={this.props.data.is_enews == 0 ? "true" : null } style={{margin: "0 0.5em 0 0", verticalAlign: "middle"}} /><label htmlFor="enews_0">不願意</label>
					</div>
					<div>
						<a href="#5" data-toggle="tab" className="btn btn-primary btn-block" onClick={this.formSubmit}>確認</a>
					</div>
				</div>
			</div>
		)
	}
})

var ChangePassword = React.createClass({
	formSubmit(){
		document.getElementById("valid_password").innerHTML = ""
		var account = localStorage.account || sessionStorage.account
		var password = localStorage.password || sessionStorage.password

		if( this.validatePassword(this.refs.password.value) == false )
			browserHistory.push('/member/error/'+8)
		else if(password != this.refs.password.value)
			browserHistory.push('/member/error/'+5)
		else if(this.refs.new_password.value != this.refs.new_password_2.value)
			browserHistory.push('/member/error/'+6)
		else if( account != null && password != null ) {
			axios.post("/api/json/member/change_ps", {
				account: account,
				password: password,
				new_password: this.refs.new_password.value				
			}).then((response)=>{
				if(response.data.state == true){
					this.refs.password.value = ""
					this.refs.new_password.value = ""
					this.refs.new_password_2.value = ""
					if(localStorage.password!=null)
						localStorage.setItem("password", response.data.password)
					else
						sessionStorage.setItem("password", response.data.password)
					document.getElementById("tab_4").className = ""					
				}
				else{
					browserHistory.push('/member/error/'+response.data.error)
				}
		  }).catch((response)=>{
		  	browserHistory.push('/member/error/'+response.data.error)
		  })
		}
	},
	validatePassword(value) {
  	var re = /^[a-z0-9]{4,}$/
  	return re.test(value)
  },
	render(){
		return(
			<div className="form_member">
				<div style={{textAlign: "center", color: "#000"}}>變更密碼</div>
				<div>
					<input type="password" ref="password" className="form-control" placeholder="請輸入舊密碼" />
					<div id="valid_password"></div>
				</div>
				<div>
					<input type="password" ref="new_password" className="form-control" placeholder="請輸入新密碼" />
				</div>
				<div>
					<input type="password" ref="new_password_2" className="form-control" placeholder="再次輸入新密碼" />
				</div>
				<div>
					<a href="#6" data-toggle="tab" className="btn btn-primary btn-block" onClick={this.formSubmit}>確認</a>
				</div>
				<br />
				<br />
			</div>
		)
	}
})

var Member = React.createClass({
	getInitialState(){
    return { member_data: [] }
  },
	componentWillMount(){
		var account = localStorage.account || sessionStorage.account
		var password = localStorage.password || sessionStorage.password

		if( account != null && password != null ) {
			axios.post("/api/json/member/info", {
				account: account,
				password: password
			}).then((response)=>{
				if(response.data.state == true){
					this.setState({ member_data: response.data.data })
				}
				else{
					console.log("登入失敗，請檢查您的帳號與密碼是否有誤，謝謝。")
				}
		  }).catch((response)=>{
		  	console.log("登入失敗，請聯絡相關人員，謝謝。")
		  })
		}		
		else
			browserHistory.push('/member/signin')
	},
	signOut(){
		if(confirm("確定登出嗎?")) {
			sessionStorage.clear()
			localStorage.clear()
			browserHistory.push('/member/signin')
		}
	},
  render(){
  	var member_edit = this.state.member_data.length != 0 ? <MemberEdit data={this.state.member_data} /> : null
  	
  	return(
  		<div className="html_width_space">
  			<br />
       	<ul className="nav nav-tabs" style={{display: "flex", justifyContent: "center"}}>
					<li id="tab_1" className="active"><a href="#1" data-toggle="tab" >會員</a></li>
					{/*<li id="tab_2"><a href="#2" data-toggle="tab" >查詢密碼</a></li>*/}
	        <li id="tab_3"><a href="#3" data-toggle="tab" >資料修改</a></li>
	        <li id="tab_4"><a href="#4" data-toggle="tab" >變更密碼</a></li>
					<li><a href="#" onClick={this.signOut}>登出</a></li> 
				</ul>
	      <div className="tab-content">
          <div className="tab-pane fade active in" id="1">
          	<MemberIndex />
          </div>
          {/*<div className="tab-pane fade" id="2">
            <MemberInquire />
          </div>*/}
          <div className="tab-pane fade" id="3">
            {member_edit}
          </div>
          <div className="tab-pane fade" id="4">
            <ChangePassword />
          </div>
          <div className="tab-pane fade" id="5">
          	<div style={{textAlign: "center", margin: "3em auto"}}>
          		更新完成 ! 您現在可以繼續使用會員的相關服務，以及活動與課程的報名 !
          	</div>
          </div>
          <div className="tab-pane fade" id="6">
          	<div style={{textAlign: "center", margin: "3em auto"}}>
          		變更完成 ! 您現在可以繼續使用會員的相關服務，以及活動與課程的報名 !
          	</div>
          </div>
	      </div>
	    </div>
  	)
  }
})
export default Member