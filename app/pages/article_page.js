import React from 'react'
import Article from './article'

var ArticlePage = React.createClass({
	render() {
		return (
			<div>
				<Article member={this.props.params.article_id} />
			</div>
		)
	}
})
export default ArticlePage