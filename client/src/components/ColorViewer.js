import { useState, useEffect } from "react"
import axios from "axios"
import styled from "styled-components"

const calcHexCode = (hex, opacity) => {
	let code = Math.floor(parseInt((opacity / 100) * 255)).toString(16)
	code = code.length === 1 ? `0${code}` : code
	let color = hex
	if (hex.length === 3) {
		color = `${hex.charAt(0).repeat(2)}${hex.charAt(1).repeat(2)}${hex
			.charAt(2)
			.repeat(2)}`
	}
	return `#${color}${code}`
}

const Outer = styled.div`
	background: ${(props) => calcHexCode(props.hexColor, props.opacity)};
	height: 80vh;
	width: 85vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

const Inner = styled.div`
	opacity: 1;
	background: #fff;
	height: 25vh;
	width: 35vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-bottom: 12px;
`

const PushToPalette = styled.button`
	padding: 4px 8px;
	background: #fff;
	border: 1px solid black;
	border-radius: 12px;
	&:active {
		color: #${(props) => props.active};
		border: 1px solid #${(props) => props.active};
	}
`

const Palette = styled.div`
	background: #fff;
	height: 25vh;
	width: 35vw;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	padding: 24px 16px;
	box-sizing: border-box;
`

const Red = styled.span`
	color: rgba(${(props) => props.red}, 0, 0, 1);
	padding: 12px 37.6px;
	background: #fff;
`

const Green = styled.span`
	opacity: 1;
	color: rgba(0, ${(props) => props.green}, 0, 1);
	padding: 12px 37.6px;
	background: #fff;
`

const Blue = styled.span`
	opacity: 1;
	color: rgba(0, 0, ${(props) => props.blue}, 1);
	padding: 12px 37.6px;
	background: #fff;
`

const HexEdit = styled.input`
	padding: 13px;
	margin-bottom: 4px;
`

const Slide = styled.input`
	width: 175px;
	margin: 0;
	margin-bottom: 8px;
`

const ColorSquare = styled.div`
	height: 50px;
	width: 75px;
	flex: 1;
	background: #${(props) => props.color};
	border: 1px solid black;
	margin: 8px;
`

const PaletteName = styled.input`
	width: calc(80% - 32px);
	font-size: 24px;
	line-height: 28px;
	padding: 0;
	border: none;
	display: ${(props) => (props.showing ? "inline-block" : "none")};
	&:focus-visible {
		border: none;
		outline-style: none;
	}
`

const PaletteColors = styled.div`
	width: calc(100% - 24px);
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 12px;
`

const AddColorDisplay = styled.h1`
	font-size: 24px;
	line-height: 28px;
	margin: 0 12px;
`

const SubmitPalette = styled.button`
	padding: 4px 8px;
	background: #fff;
	border: 1px solid #000;
	border-radius: 8px;
	&:active {
		color: #fff;
		background: #000;
	}
`

const PaletteDisplay = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
`

const ColorViewer = (props) => {
	const [hex, setHex] = useState("000000")
	const [hexColor, setHexColor] = useState("000")
	const [red, setRed] = useState(255)
	const [green, setGreen] = useState(255)
	const [blue, setBlue] = useState(255)
	const [opacity, setOpacity] = useState(100)
	const [paletteColors, setPaletteColors] = useState([])
	const [colorComponents, setColorComponents] = useState([])
	const [previousRGB, setPreviousRGB] = useState({})
	const [paletteName, setPaletteName] = useState('')

	useEffect(async () => {
		let color
		if ([3, 4, 6, 8].includes(hex.length)) {
			color = await axios.get(`http://localhost:5000/hex/${hex}`)
		}
		if (color) {
			const { hex, r, g, b } = color.data
			setHexColor(hex.slice(1))
			setPreviousRGB({ red, green, blue })
			setRed(r)
			setGreen(g)
			setBlue(b)
		}
	}, [hex])

	const handleColorChange = (e) => {
		const str = e.target.value.toUpperCase()
		const chars = '0123456789ABCDEF'.split('')
		if (str.split('').every((char) => chars.includes(char)) && str.length <= 8)
		{
			setHex(str)
		}
	}

	const handleOpacityChange = (e) => {
		setOpacity(e.target.value)
	}

    const addToPalette = () => {
        let fullHex = ""
		if (hexColor.length === 3 || hexColor.length === 4) {
			for (let char of hexColor) {
				fullHex += char.repeat(2).toUpperCase()
			}
		} else {
			fullHex = hexColor.toUpperCase()
        }
		if (paletteColors.length < 5 && !paletteColors.includes(fullHex)) {
			setColorComponents([
				...colorComponents,
				{ [fullHex.toUpperCase()]: { red, green, blue } }
            ])
			setPaletteColors([...paletteColors, fullHex.toUpperCase()])
		}
	}

	const handleColorMouseEnter = (e) => {
		setPreviousRGB({ red, green, blue })
		const hexKey = e.target.attributes.color.value.toUpperCase()
		const color = colorComponents.find((rgb) => {
			return Object.keys(rgb)[0] === hexKey
		})
		setRed(color[hexKey].red)
		setGreen(color[hexKey].green)
		setBlue(color[hexKey].blue)
	}

	const handleColorMouseLeave = () => {
		const { red, green, blue } = previousRGB
		setRed(red)
		setGreen(green)
		setBlue(blue)
	}

	const handleDoubleClick = (e) => {

		const filteredPalette = [...paletteColors].filter((color) => {
			let fullHex = ""
			if (color.length === 3 || color.length === 4) {
				for (let char of color) {
					fullHex += char.repeat(2)
				}
			} else {
				fullHex = color
			}
			return fullHex !== e.target.attributes.color.value.toUpperCase()
		})

        const filteredComponents = [...colorComponents].filter((color) => {
            return (
				Object.keys(color)[0] !==
				e.target.attributes.color.value.toUpperCase()
			)
		})

		setPaletteColors(filteredPalette)
		setColorComponents(filteredComponents)

	}

	const handleSubmitPalette = () => {

		if (paletteName.length > 0) {

			const colorData = []
			paletteColors.forEach((color) => {
				const colorBreakdown = {}
				colorBreakdown.hex = color
				const components = colorComponents.find((colorObj) => {
					return Object.keys(colorObj)[0] === color
				})
				const { red, green, blue } = components[color]
				colorBreakdown.red = red
				colorBreakdown.green = green
				colorBreakdown.blue = blue
				colorData.push(colorBreakdown)
			})
			const palette = {
				name: paletteName,
				colors: colorData
			}

			axios.post(`http://localhost:5000/palettes`, palette)
			props.newPalette(palette)

			props.toggle()

		}

	}

	return (
		<Outer hexColor={hexColor} opacity={opacity}>
			<h1>
				<Red red={red}>HEX</Red> <Green green={green}>COLOR</Green>{" "}
				<Blue blue={blue}>CODE</Blue>
			</h1>
			<Inner>
				<HexEdit value={hex} onChange={handleColorChange} />
				<Slide
					type="range"
					min={0}
					max={100}
					step={1}
					value={opacity}
					onChange={handleOpacityChange}
				/>
				<PushToPalette onClick={addToPalette} active={hexColor}>
					Add To Palette
				</PushToPalette>
			</Inner>
			<Palette>
				{paletteColors.length > 2 ? (
					<PaletteDisplay>
						<PaletteName
							value={paletteName}
							onChange={(e) => setPaletteName(e.target.value)}
							placeholder="Palette Name"
							showing={paletteColors.length > 2}
						/>
						<SubmitPalette onClick={handleSubmitPalette}>Post</SubmitPalette>
					</PaletteDisplay>
				) : (
					<AddColorDisplay>Add More Colors</AddColorDisplay>
				)}
				<PaletteColors>
					{paletteColors.map((color) => {
						let fullHex = ""
						if (color.length === 3 || color.length === 4) {
							for (let char of color) {
								fullHex += char.repeat(2)
							}
						} else {
							fullHex = color
						}

						return (
							<ColorSquare
								onMouseEnter={handleColorMouseEnter}
								onMouseLeave={handleColorMouseLeave}
								onDoubleClick={handleDoubleClick}
								key={`#${fullHex}`}
								color={fullHex}
							/>
						)
					})}
				</PaletteColors>
			</Palette>
		</Outer>
	)
}

export default ColorViewer
