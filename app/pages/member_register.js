import React from 'react'
import axios from 'axios'
import { Link, browserHistory } from 'react-router'

var MemberRegister = React.createClass({
	getInitialState(){
    return { city_data: [], area_data: [], industry_data1: [], industry_data2: [], industry_data3: [], source_data: [], institution_data: [] }
  },
	componentWillMount(){
		axios.get('/api/json/city_data').then((result)=>this.setState({ city_data: result.data }))
		axios.get('/api/json/industry_data/0').then((result)=>this.setState({ industry_data1: result.data }))
		axios.get('/api/json/source_data').then((result)=>this.setState({ source_data: result.data }))
		axios.get('/api/json/institution_data').then((result)=>this.setState({ institution_data: result.data }))
	},	
	formSubmit(){	
		for(var i = 0; i < document.getElementsByClassName("valid_field").length; i++)
			document.getElementsByClassName("valid_field")[i].innerHTML=""

		if( this.validateEmail(this.refs.email.value) == false ) {
			document.getElementById("valid_email").innerHTML = "*信箱格式錯誤"
			this.refs.email.focus()
		}
		else if( this.validateNumber(this.refs.phone.value) == false ) {
			document.getElementById("valid_phone").innerHTML = "*手機格式錯誤"
			this.refs.phone.focus()
		}
		else if( this.validatePassword(this.refs.password.value ) == false) {
			document.getElementById("valid_password").innerHTML = "*密碼格式錯誤"
			this.refs.password.focus()
		}
		else if( this.refs.birthday.value.trim() == false ) {
			document.getElementById("valid_birthday").innerHTML = "*欄位不得為空"
			this.refs.birthday.focus()
		}
		else if( this.validateChinese(this.refs.name.value) == false ) {
			document.getElementById("valid_name").innerHTML = "*請輸入中文名稱"
			this.refs.name.focus()
		}
		else if( this.refs.nickname.value.trim() == false ) {
			document.getElementById("valid_nickname").innerHTML = "*欄位不得為空"
			this.refs.nickname.focus()
		}
		// else if( this.refs.company_name.value == "" ) {
		// 	document.getElementById("valid_company_name").innerHTML = "*欄位不得為空"
		// 	this.refs.company_name.focus()
		// }
		else if( this.refs.company_city.value == 0 ) {
			document.getElementById("valid_company_city").innerHTML = "*欄位不得為空"
			this.refs.company_city.focus()
		}
		else if( this.refs.company_area.value == 0 ) {
			document.getElementById("valid_company_area").innerHTML = "*欄位不得為空"
			this.refs.company_area.focus()
		}
		else if( this.refs.company_address.value.trim() == false ) {
			document.getElementById("valid_company_address").innerHTML = "*欄位不得為空"
			this.refs.company_address.focus()
		}
		else if( this.refs.company_phone.value.trim() == false ) {
			document.getElementById("valid_company_phone").innerHTML = "*欄位不得為空"
			this.refs.company_phone.focus()
		}
		else if( this.refs.job_title.value.trim() == false ) {
			document.getElementById("valid_job_title").innerHTML = "*欄位不得為空"
			this.refs.job_title.focus()
		}
		else if( this.refs.company_type1.value == 0 ) {
			document.getElementById("valid_company_type1").innerHTML = "*欄位不得為空"
			this.refs.company_type1.focus()
		}
		else if( this.state.industry_data2.length != 0 && this.refs.company_type2.value == 0 ) {
			document.getElementById("valid_company_type2").innerHTML = "*欄位不得為空"
			this.refs.company_type2.focus()
		}
		else if( this.state.industry_data3.length != 0 && this.refs.company_type3.value == 0 ) {
			document.getElementById("valid_company_type3").innerHTML = "*欄位不得為空"
			this.refs.company_type3.focus()
		}
		else if( this.refs.source.value == 0 ) {
			document.getElementById("valid_source").innerHTML = "*欄位不得為空"
			this.refs.source.focus()
		}
		else if( this.refs.is_check.checked == false ) {
			document.getElementById("valid_is_check").innerHTML = "*您尚未同意會員條款內容"
			this.refs.is_check.focus()
		}
		else {
			document.getElementById("loading").style.display = "block"
			axios.post("/api/json/member/create", {
				email: this.refs.email.value,
				phone: this.refs.phone.value,
				password: this.refs.password.value,
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
				source: this.refs.source.value,
				is_enews: this.refs.enews_1.checked ? this.refs.enews_1.value : this.refs.enews_0.value,
				institution: this.refs.institution.value,
				reference: this.refs.reference.value
			}).then((response)=>{
				if(response.data.state == true){
					sessionStorage.setItem("temp_nickname", response.data.nickname)
					sessionStorage.setItem("temp_account", response.data.account)
					sessionStorage.setItem("temp_phone", response.data.phone)					
					browserHistory.push("/member/success/5")						
				}
				else if(response.data.state == false){
					document.getElementById("valid_email").innerHTML = response.data.error
					this.refs.email.focus()
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
  validatePassword(value) {
  	var re = /^[a-z0-9]{4,}$/
  	return re.test(value)
  },
  validateChinese(value) {
  	var re = /^[\u0391-\uFFE5]+$/
  	return re.test(value)
  },
  validateNumber(value) {
  	var re = /^-?\d+$/
  	return re.test(value)
  },
	getArea(x){
		axios.get('/api/json/area_data/'+x.target.value).then((result)=>this.setState({ area_data: result.data }))
	},
	setArea(){
		return this.state.area_data.map((x, y)=><option key={"area_"+y} value={x.id}>{x.Area}</option>)
	},
	getIndustry2(x){
		var x_value = x.target.value
		if(x_value != 0)
			axios.get('/api/json/industry_data/'+x_value).then((result)=>this.setState({ industry_data2: result.data, industry_data3: [] }))
		else
			this.setState({ industry_data2: [], industry_data3: [] })
	},
	setIndustry2(){
		return this.state.industry_data2.map((x, y)=><option key={"industry_data2_"+y} value={x.id}>{x.option}</option>)
	},
	getIndustry3(x){
		var x_value = x.target.value
		if(x_value != 0)
			axios.get('/api/json/industry_data/'+x_value).then((result)=>this.setState({ industry_data3: result.data }))
		else
			this.setState({ industry_data3: [] })
	},
	setIndustry3(){
		return this.state.industry_data3.map((x, y)=><option key={"industry_data3_"+y} value={x.id}>{x.option}</option>)
	},
	render(){
		return(
			<div style={{margin: "2em 0"}}>
				<div className="form_member">
					<div style={{display: "flex", justifyContent: "space-between"}}>
						<h4>會員註冊</h4>
						<Link to="/member/signin" className="btn btn-warning">立即登入 !</Link>
					</div>
					<h6 className="underline-type1"></h6>
					<div>請輸入下列個人資料</div>
					<div>
						<input type="text" ref="email" name="email" className="form-control" placeholder="請輸入您的email" />
						<div id="valid_email" className="valid_field"></div>
						<p className="help-block">*此mail帳號，即為登入會員的帳號，也是日後收取相關會員活動信件之信箱</p>
					</div>					
					<div>
						<input type="text" ref="phone" name="phone" className="form-control" placeholder="請輸入您的手機號碼" />
						<div id="valid_phone" className="valid_field"></div>
						<p className="help-block">*此手機號碼，也為登入會員的帳號，也是日後收取相關會員活動簡訊之門號</p>
					</div>					
					<div>
						<input type="password" ref="password" name="password" className="form-control" placeholder="請輸入密碼" />
						<div id="valid_password" className="valid_field"></div>
						<p className="help-block">*至少4位數之數字或英文小寫</p>
					</div>					
					<div>
						<input type="date" ref="birthday" name="birthday" className="form-control" placeholder="請輸入您的生日" />
						<div id="valid_birthday" className="valid_field"></div>
						<p className="help-block">*格式19800101</p>
					</div>					
					<div>
						<input type="text" ref="name" name="name" className="form-control" placeholder="請輸入您的中文全名" />
						<div id="valid_name" className="valid_field"></div>
					</div>
					<div>
						<input type="text" ref="nickname" name="nickname" className="form-control" placeholder="請輸入您的英文名或暱稱" />
						<div id="valid_nickname" className="valid_field"></div>
					</div>
					<h6 className="underline-type1"></h6>
					<div>請輸入下列工作資料</div>
					<div>
						<input type="text" ref="company_name" name="company_name" className="form-control" placeholder="請輸入公司名稱" />
						<div id="valid_company_name" className="valid_field"></div>
						<p className="help-block">*個人單位免填</p>
					</div>
					<div>
						<select className="form-control" ref="institution" name="institution">
							{	this.state.institution_data.map((x, y)=><option key={"institution_"+y} value={x.id}>{x.option}</option>) }
						</select>
					</div>
					{/*<div>
						<input type="text" ref="company_id" name="company_id" className="form-control" placeholder="請輸入公司統編" />						
					</div>*/}
					<div>
						<select ref="company_type1" name="company_type1" className="form-control" onChange={this.getIndustry2}>
							<option value="0">請選擇公司產業類別1</option>
							{ this.state.industry_data1.map((x, y)=><option key={"industry_data1_"+y} value={x.id}>{x.option}</option>) }
						</select>
						<div id="valid_company_type1" className="valid_field"></div>
					</div>
					<div>
						<select ref="company_type2" name="company_type2" className="form-control" onChange={this.getIndustry3}>
							<option value="0">請選擇公司產業類別2</option>
							{	this.setIndustry2() }
						</select>
						<div id="valid_company_type2" className="valid_field"></div>
					</div>
					<div>
						<select ref="company_type3" name="company_type3" className="form-control">
							<option value="0">請選擇公司產業類別3</option>
							{	this.setIndustry3() }
						</select>
						<div id="valid_company_type3" className="valid_field"></div>
					</div>
					<div>
						<input type="text" ref="department" name="department" className="form-control" placeholder="請輸入部門名稱" />
					</div>
					<div>
						<input type="text" ref="job_title" name="job_title" className="form-control" placeholder="請輸入您的職稱" />
						<div id="valid_job_title" className="valid_field"></div>
					</div>
					<h6 className="underline-type1"></h6>
					<div>請輸入下列通訊資料</div>
					<div>
						<select ref="company_city" name="company_city" className="form-control" onChange={this.getArea}>
							{	this.state.city_data.map((x, y)=><option key={"city_"+y} value={x.id}>{x.City}</option>) }
						</select>
						<div id="valid_company_city" className="valid_field"></div>
					</div>
					<div>
						<select ref="company_area" name="company_area" className="form-control">							
							{	this.setArea() }
						</select>
						<div id="valid_company_area" className="valid_field"></div>
					</div>
					<div>
						<input type="text" ref="company_address" name="company_address" className="form-control" placeholder="請輸入地址" />
						<div id="valid_company_address" className="valid_field"></div>
					</div>
					<div>
						<input type="text" ref="company_phone" name="company_phone" className="form-control" placeholder="請輸入您的辦公室電話" />
						<div id="valid_company_phone" className="valid_field"></div>
					</div>
					<div>
						<input type="text" ref="reference" name="reference" className="form-control" placeholder="請輸入您的推薦人" />
					</div>
					<h6 className="underline-type1"></h6>
					<div>會員來源調查</div>
					<div>
						<select ref="source" name="source" className="form-control">
							<option value="0">請問您如何得知本網站</option>
							{ this.state.source_data.map((x, y)=><option key={"source_"+y} value={x.id}>{x.option}</option>) }
						</select>
						<div id="valid_source" className="valid_field"></div>
					</div>
					<div>是否願意收到大塚電子報及活動訊息通知</div>
					<div>
						<input type="radio" ref="enews_1" name="enews" id="enews_1" value="1" defaultChecked="true" style={{margin: "0 0.5em 0 0", verticalAlign: "middle"}} /><label htmlFor="enews_1">願意</label>
					</div>
					<div>
						<input type="radio" ref="enews_0" name="enews" id="enews_0" value="0" style={{margin: "0 0.5em 0 0", verticalAlign: "middle"}} /><label htmlFor="enews_0">不願意</label>
					</div>
					<div>
						<div className="form-control" style={{height: "150px", overflow: "auto"}}>
							大塚資訊科技蒐集處理及利用個人資料告知事項<br/>
							本公司依據個人資料保護法（以下稱個資法）第八條第一項規定，向台端告知下列事項，請台端詳閱：<br/>
							1.蒐集之目的：<br/>
							蒐集目的在於進行大塚資訊科技所開設課程之報名通知、不定期發送本公司所辦理相關活動訊息、提供予展示廠商業務交流及其他合於本公司營業登記項目或章程所定業務等需要。<br/>
							2.蒐集之個人資料類別：<br/>
							合於前述目的所需蒐集之個人各項資料及與本公司往來之個人資料，包含姓名、職稱、公司名稱、部門、電話、行動電話、e-mail等，得以直接或間接方式識別該個人之資料。<br/>
							3.個人資料利用之期間、地區、對象及方式：<br/>
							(一) 期間：於主管機關許可業務經營之存續期間內，符合下列要件之一者： <br/>
							1. 個人資料蒐集之特定目的存續期間。<br/>
							2. 依相關法令規定或契約約定之保存年限。<br/>
							3. 本公司因執行業務所必需之保存期間。<br/>
							(二) 地區：獲主管機關許可經營及營業登記項目或章程所定之業務，其營業活動之相關地區及為達蒐集、處理及利用目的所必須使用之相關地區：包含本公司、本公司之關係企業、與本公司因業務需要訂有契約之機構或顧問等所在之地區。<br/>
							(三)對象：本公司、本公司之關係企業、或與本公司因業務需要訂有契約關係或業務往來之機構或顧問(如律師、會計師)；金融監理或依法有調查權或依法行使公權力之機關。<br/>
							4.依據個資法第三條規定，台端就本公司保有台端之個人資料得行使下列權利：<br/>
							(一) 得向本公司查詢、請求閱覽或請求製給複製本，而本公司依法得酌收必要成本費用。 <br/>
							(二) 得向本公司請求補充或更正，惟依法台端應為適當之釋明。<br/>
							(三) 得向本公司請求停止蒐集、處理或利用及請求刪除，惟依法本公司因執行業務所必須者，得不依台端請求為之。 <br/>
							5.台端不提供個人資料所致權益之影響：<br/>
							台端得自由選擇是否提供相關個人資料，惟台端若拒絕提供相關個人資料，本公司將無法進行必要之審核及處理作業，致無法提供台端相關服務。<br/>
						</div>
					</div>
					<div>
						<input type="checkbox" ref="is_check" name="is_check" id="is_check" style={{marginRight: "0.5em"}} />我已閱覽<a href="/member_terms" target="_blank" >會員條款</a>所述內容，並同意個資使用之相關條文。 
						<div id="valid_is_check" className="valid_field"></div>
					</div>
					<div>
						<input type="button" className="btn btn-primary btn-block" value="資料提交" onClick={()=>this.formSubmit()} />
					</div>
					<div id="loading" style={{width: "100%", height: "100%", top: "1.5em", position: "fixed", textAlign: "center", zIndex: "999", display: "none"}}><img src="/img/loading.gif" width="50px" style={{marginTop: "10em"}} /></div>
				</div>
			</div>
		)
	}
})
export default MemberRegister