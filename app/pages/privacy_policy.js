import React from 'react'

var PrivacyPolicy = React.createClass({
	render(){
		return(
			<div>
				<div className="terms">
					<div style={{textAlign: "center", marginBottom: "2em"}}>
						<h2 style={{color: "#2288cc", paddingBottom: "1em", borderBottom: "1px #ccc solid"}}>大塚官方網站服務之隱私權政策</h2>
					</div>
					<div><b>1. 大塚設有相關部門與人員適當處理個人資訊。</b></div>
					<br />
					<div><b>2. 大塚遵守公司政策以及採用合理的安全措施來保護避免個人資料非授權存取、遺失、異動，或將個人資訊提供給第三者。</b></div>
					<br />
					<div><b>3. 除了以下的情形外，大塚不會將個人資料提供給第三者。</b></div>
					<div style={{display: "flex"}}><div style={{margin: "0 0.5em"}}>•</div><div>當獲得使用者授權本公司可提供個人資料時</div></div>
					<div style={{display: "flex"}}><div style={{margin: "0 0.5em"}}>•</div><div>當法律要求本公司提供個人資料時</div></div>
					<div style={{display: "flex"}}><div style={{margin: "0 0.5em"}}>•</div><div>當處理統計資料時(如性別、年齡等)，此部分並不涉及任何特定之個人資訊。</div></div>
					<br />
					<div><b>4. 使用者有權利隨時存取網站修改個人資訊。使用者可能需要使用網站上特定的電子表單或連絡大塚客服中心。</b></div>
					<br />
					<div><b>5. 大塚將會持續審視與修正線上之隱私權政策，以符合法律適用性與其它涵蓋個人資料保護的規定。</b></div>
					<br />
					<h4>Cookies 的使用</h4>
					<div>部分大塚網站提供的服務使用"cookies" 來追蹤造訪者的行為。"cookie" 是一種電腦資料形式，可辨識使用者的電腦存取大塚網站。 除非您提供個人資訊，否則大塚網站將無法辨別您的身分。因此透過您接收cookies的授權，方能讓網站伺服機辨識儲存在您電腦中 的cookies 資料。當您造訪大塚網站時，Cookies 會被取代更新，不會被其它網站獲得您的個人資訊。使用者可以更改瀏覽器設定來關閉cookies 的使用，但如此將會限制大塚網站特定服務的使用。</div>
				</div>
			</div>
		)
	}
})
export default PrivacyPolicy