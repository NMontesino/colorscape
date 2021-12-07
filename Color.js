class Color {
	constructor(...args) {
		if (args.length == 3 || args.length === 4) {
			this.r = args[0]
			this.g = args[1]
			this.b = args[2]

			this.a = args[3] || 1

			this.hex = this.rgbToHex(this.r, this.g, this.b)
		} else if (args.length === 1) {
			this.hex = args[0]

			const rgb = this.hexToRGB(this.hex)
			const values = rgb.split(", ")

			this.r = parseInt(values[0].slice(values.length + 1))
			this.g = parseInt(values[1])
			this.b =
				values.length === 3
					? parseInt(values[2].slice(0, -1))
					: parseInt(values[2])

			this.a =
				values.length === 4 ? parseFloat(values[3].slice(0, -1)) : 1
		} else {
			this.hex = null

			this.r = null
			this.g = null
			this.b = null

			this.a = null
		}
	}

	hexify = (n) => {
		const int = parseInt(n)
		return int.toString(16)
	}
	unhex = (hex) => {
		return parseInt(hex, 16)
	}

	rgbToHex = (red, green, blue) => {
		if ([red, green, blue].some((color) => color > 255 || color < 0))
			return "Invalid RGB Value"

		const { hexify } = this

		let r = hexify(red)
		r = r.length === 1 ? `0${r}` : r
		let g = hexify(green)
		g = g.length === 1 ? `0${g}` : g
		let b = hexify(blue)
		b = b.length === 1 ? `0${b}` : b

		return `#${r}${g}${b}`.toUpperCase()
	}
	hexToRGB = (hex) => {
		const { unhex } = this

		if (hex.charAt(0) !== "#") return "Must provide a hexadecimal value"

		let value = hex.slice(1, hex.length)
		if (![3, 4, 6, 8].includes(value.length))
			return "Invalid RGB/RGBA Value"
		if (value.length === 3 || value.length === 4) {
			value = [
				value.charAt(0).repeat(2),
				value.charAt(1).repeat(2),
				value.charAt(2).repeat(2),
				value.length === 4 ? value.charAt(3).repeat(2) : null
			].join("")
		}

		const hexR = value.slice(0, 2)
		const r = unhex(hexR)
		const hexG = value.slice(2, 4)
		const g = unhex(hexG)
		const hexB = value.slice(4, 6)
		const b = unhex(hexB)
		const colors = [
			{
				color: "Red",
				value: r,
				hexValue: hexR
			},
			{
				color: "Green",
				value: g,
				hexValue: hexG
			},
			{
				color: "Blue",
				value: b,
				hexValue: hexB
			}
		]

		const invalidValues = []
		colors.forEach((colorObject) => {
			const { color, value, hexValue } = colorObject
			if (isNaN(value)) {
				invalidValues.push(`Invalid ${color} Value: '${hexValue}'`)
			}
		})
		if (invalidValues.length > 0) return invalidValues

		const a = (value.length === 8 ? unhex(value.slice(6, 8)) : null) / 100
		if (a > 1 || a < 0) return "Invalid Alpha Value"

		return a ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`
	}

	rgb = () => {
		const { r, g, b } = this
		return `rgb(${r}, ${g}, ${b})`
	}
	rgba = () => {
		const { r, g, b, a } = this
		return `rgba(${r}, ${g}, ${b}, ${a})`
	}
	red = () => {
		return this.r
	}
	green = () => {
		return this.g
	}
	blue = () => {
		return this.b
	}
	getHex = () => {
		return this.hex
	}
}


module.exports = Color
