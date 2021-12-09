const express = require('express')
const app = express()
const mongoose = require("mongoose")
const config = require("./config/database")
// const bodyParser = require('body-parser')
const cors = require('cors')
const Color = require('./Color')
const PORT = 5000
const Schema = mongoose.Schema

const connection = mongoose.connect(config.database, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
if (connection) {
	console.log("database connected")
} else {
	console.log("database connection error")
}

const colorPaletteSchema = new Schema({
	name: String,
	colors: [{
		hex: String,
		red: Number,
		green: Number,
		blue: Number
	}]
}, {
	collection: 'colorPalettes'
})

const ColorPalette = mongoose.model("ColorPalette", colorPaletteSchema)
mongoose.connect("mongodb://localhost:27017/colorPalettes")


app.use(express.json())
app.use(cors())

app.get("/palettes", (req, res) => {

	ColorPalette.find((err, docs) => {
		if (!err) {
			res.json({data: docs})
		}
	})

})
app.post('/palettes', (req, res) => {

	const palette = new ColorPalette(req.body)
	palette.save((err, doc) => {
		if (err) res.json({err: err})
		res.json({success: "Document inserted succussfully!", doc: doc})
	})

})


app.get('/hex/:hexcode', (req, res) => {

    const { hexcode } = req.params

    const color = new Color(`#${hexcode}`)
    res.json({
		rgb: color.rgb(),
		hex: color.getHex(),
		r: color.red(),
		g: color.green(),
		b: color.blue()
	})

})
app.get("/rgb/:r/:g/:b", (req, res) => {

    const { r, g, b } = req.params

    const color = new Color(r, g, b)
    res.json({
        rgb: color.rgb(),
        hex: color.getHex(),
        r: color.red(),
        g: color.green(),
        b: color.blue()
    })

})
app.get("/rgba/:r/:g/:b/:a", (req, res) => {

	const { r, g, b, a } = req.params

	const color = new Color(r, g, b, a)
    res.json({
		rgba: color.rgba(),
		hex: color.getHex(),
		r: color.red(),
		g: color.green(),
		b: color.blue()
	})
    
})

app.listen(PORT)