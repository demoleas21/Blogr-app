var GetComments = React.createClass({
    render: function() {
        var commentJson = JSON.parse(Get("http://localhost:5000/comments"));
        var messages = [];
        for (var i in commentJson.comments) {
            var author = commentJson.comments[i].author;
            var comment = commentJson.comments[i].comment;
            var message = '"' + comment + '"' + ' written by ' + "'" + author + "'\n";
            messages.push(message);
        }
        console.log(messages)
        return <p>{messages}</p>;
    }
});
ReactDOM.render(
    <GetComments/>,
    document.getElementById('container')
);
function Get(whateverUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",whateverUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
};
