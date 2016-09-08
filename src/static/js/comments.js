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
        $.ajax({
            url: this.props.url,
            dataType: 'json',
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
    getInitialState: function() {
        return ({data: []})
    },
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment
                    author={comment.author}
                    key={comment.id.toString()}
                    text={comment.comment}
                />
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
    handleAuthorChange: function(e) {
        this.setState({author: e.target.value})
    },
    handleCommentChange: function(e) {
        this.setState({comment: e.target.value})
    },
    handleSubmit: function(e) {
        e.preventDefault();
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
    handleCommentSubmit: function(comment) {
        $.ajax({
            url: "http://localhost:5000/comments/1",
            dataType: 'json',
            method: 'PUT',
            data: comment,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('http://localhost:5000/comments/1', status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {showEditable: false};
    },
    onClick: function() {
        if (this.state.showEditable === true) {
            this.setState({showEditable: false});
        } else {
            this.setState({showEditable: true});
        }
    },
    handleCommentChange: function(e) {
        this.setState({comment: e.target.value});
        console.log(this.state.comment);
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var comment = this.state.comment.trim();
        if (!comment) {
            return;
        }
        console.log('submit handled');
        this.handleCommentSubmit({comment: comment});
        this.onClick();
    },
    render: function() {
        console.log(this.props.id);
        console.log(this.props.text);
        if (this.state.showEditable === true) {
            return (
                <form className="comment" onSubmit={this.handleSubmit}>
                    <h2 className="commentAuthor">
                        {this.props.author}
                    </h2>
                    <input
                        defaultValue={this.props.text}
                        onChange={this.handleCommentChange}
                    />
                    <br/>
                    <input type="submit" value="Update" />
                </form>
            );
        } else {
            return (
                <div className="comment">
                    <h2 className="commentAuthor">
                        {this.props.author}
                    </h2>
                    <p>{this.props.text}</p>
                    <button onClick={this.onClick}>Edit</button>
                </div>
            );
        }
    }
});
ReactDOM.render(
    <CommentBox url="http://localhost:5000/comments" pollInterval={2000}/>,
    document.getElementById('content')
);
