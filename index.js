const express = require('express')
const app = express()
const port = 3000

/* app.use('/static', express.static(path.join(__dirname, 'public'))) */
//__filename
//__dirname

// app settings
app.use('/js', express.static('src'))
app.use('/static', express.static("public"))
app.use('/libs/', express.static("bower_components"))
app.use(express.static('/static'))

// error handler
app.get('/home', (req, res) => {
	res.send("<p>Radical ---> blaze!</p>")
})
/* start the server */
app.listen(port, () => console.log(`Example app listening on port ${port}!`))