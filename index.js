const app = require('./app');

const port = env.process.PORT || 8080;

app.listen(port, function(){
	console.log('App listening on port 8090');
});