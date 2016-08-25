import React from 'react'
import axios from 'axios'
import {Link} from 'react-router'
import ReactMarkdown from 'react-markdown'

var Footer = React.createClass({
	getInitialState:function(){
    return {data: [], config: []}
  },
  componentWillMount:function(){
    axios.get('/api/json/footers').then((result)=>this.setState({data:result.data}))
		axios.get('/api/json/configs').then((result)=>{
    	var conf = {}
    	result.data.forEach(x=>conf[x.name] = x.value)
    	this.setState({config: conf})
    })
  },
	render(){
		return (
			<div style={{width: "100%"}}>				
					<div id='footer' style={{background: this.state.config.footer_bgcolor, lineHeight: "2em"}}>		
						<div className="html_width_space" style={{paddingLeft: "1em"}}>			
							{this.state.data.map((x,i)=>{
								return(
									<div key={"footer_"+i} style={{display: "inline-block", verticalAlign: "top"}} className="footer_style">
										<div style={{color: this.state.config.footer_main_color}}>{x.name}</div>
										<div className="pure-menu">
											{x.Footer_Second_Menus.map((y,i)=>{	
												if(y.is_url == 1)
													var alink = <a style={{color: this.state.config.footer_second_color, fontSize: "0.8em"}} href={y.url}><div dangerouslySetInnerHTML={{__html: y.name}} /></a>
												else
													var alink = <Link style={{color: this.state.config.footer_second_color, fontSize: "0.8em"}} to={"/footer_page/"+y.FooterMenuId+"/"+y.id}>{y.name}</Link>
												return (
													<li className="pure-menu-item footer_item_style" key={"footer_item_"+i}>													
														{alink}
													</li>												
												)
											})}
										</div>
									</div>
								)
							})}
						</div>	
					</div>
					<div className="copyright_border" style={{background: this.state.config.footer_bgcolor}}>
						<div className="html_width_space" style={{padding: "0em 0em", color: "#9A9A9A", fontSize: "0.7em"}}>
							<ReactMarkdown source={this.state.config.copyright ? this.state.config.copyright : ""} />
						</div>
					</div>	
			</div>
		)
	}
})

export default Footer