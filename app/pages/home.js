import React from 'react'
import Slider from 'react-slick'
import MediaQuery from 'react-responsive'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import {Link} from 'react-router'

import Loading from './loading'

//====================

var Home = React.createClass({
  getInitialState:function(){
    return {data: [], ad_data: []}
  },
  componentWillMount:function(){
    axios.get('/api/json/banners/type/'+"home").then((result)=>this.setState({data:result.data}))
    axios.get('/api/json/home_ads').then((result)=>this.setState({ad_data: result.data}))
  },
  render() {
    var settings = {
      arrows: true,
      draggable: false,
      fade: true,
      dots: true,
      infinite: true,
      autoplay: true,
      speed: 2000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplaySpeed: 7000
    };

   	var desktop_slides = Loading
  	var desktop_slides_mobile = Loading
    if(this.state.data){
	    desktop_slides = this.state.data.map((x,i)=>{
	      return(
  			  <div key={'home_'+i} >
            <a href={x.url}>
              <MediaQuery query='(min-width: 768px)'>	
  							<img src={x.img} className="bg_img" />	
				  	  </MediaQuery>
				      <MediaQuery query='(max-width: 767px)'>
  							<img src={x.mobile_img} className="bg_img" />  				
  					  </MediaQuery>
            </a>
  				  <div className="banner_text" style={{top: x.text_top+"%", left: x.text_left+"%"}}>
              <a href={x.url}>
  				 	    <ReactMarkdown source={x.text} />
              </a>  
  				  </div>
  				</div>
  			)
	    })

	    desktop_slides_mobile = this.state.data.map((x,i)=>{
	      return <div key={'home_mobile_'+i}><ReactMarkdown source={x.text} /></div>
	    })
	  }

    return (
    	<div>
	      <div className="carousel">        
	        <Slider {...settings}> 
	          {desktop_slides}
	        </Slider>        
	      </div>
	      <div className="pure-g home_ads_g">
	      	{
	      		this.state.ad_data.map((x, y)=>{
	      			var text = x.text != null ? <ReactMarkdown source={x.text} /> : null
	      			return (
	      				<a key={"ads_"+y} href={x.url} className="pure-u-lg-1-4 pure-u-md-1-2 pure-u-1" style={{padding: "0.5em", margin: "0 auto", textDecoration: "none"}}>
				      		<img className="ad_img" src={x.img} />
				      		<div className="ad_text">{text}</div>
				      	</a>
	      			)
	      		})
	      	}
	      </div>
     	</div>
    )
  }
})
export default Home