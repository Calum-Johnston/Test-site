const app = require('./app');

const port = process.env.PORT || 8080;

app.listen(port, function(){
	console.log('App listening on port 8090');
});