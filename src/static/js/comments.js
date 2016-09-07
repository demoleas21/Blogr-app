var CommentBox = React.createClass({
    getFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data.comments});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment) {
        console.log(comment);
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            // contentType: 'application/json',
            method: 'POST',
            data: comment,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.getFromServer();
        setInterval(this.getFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});
var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author} key={comment.comment_id} text={comment.comment} />
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});
var CommentForm = React.createClass({
    getInitialState: function() {
        return {author: '', comment: ''};
    },
    handleAuthorChange: function(value) {
        this.setState({author: value.target.value})
    },
    handleCommentChange: function(value) {
        this.setState({comment: value.target.value})
    },
    handleSubmit: function(value) {
        value.preventDefault();
        var author = this.state.author.trim();
        var comment = this.state.comment.trim();
        if (!author || !comment) {
            return;
        }
        this.props.onCommentSubmit({author: author, comment: comment});
        this.setState({author: '', comment: ''})
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="comment"
                    value={this.state.comment}
                    onChange={this.handleCommentChange}
                />
                <input type="submit" value="Post" />
            </form>
        );
    }
});
var Comment = React.createClass({
    render: function() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <textarea>{this.props.text}</textarea>
                <CommentEdit />
            </div>
        );
    }
});
var CommentEdit = React.createClass({
    render: function() {
        return (
            <div className="commentButton">
                <button>Edit</button>
            </div>
        );

    },
});
ReactDOM.render(
    <CommentBox url="http://localhost:5000/comments" pollInterval={20000}/>,
    document.getElementById('content')
);
