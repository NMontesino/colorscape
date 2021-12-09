import { useState, useEffect } from 'react'
import styled from "styled-components"
import axios from "axios"
import "./App.css"

import ColorViewer from "./components/ColorViewer"
import PalettesList from './components/PalettesList'

const App = () => {

	const Wrapper = styled.div`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	`
	const ViewSwitch = styled.h3`
		width: 85vw;
		text-align: left;
		&:active {
			opacity: 0.5;
		}
	`
	
	const [viewPalettes, setViewPalettes] = useState(false)
	const [palettes, setPalettes] = useState([])

	const toggle = () => {
		setViewPalettes(!viewPalettes)
	}

	const getAllPalettes = () => {
		axios
			.get(`https://colorscape-api.herokuapp.com/palettes`)
			.then((res) => {
				const allPalettes = res.data.data
				setPalettes(allPalettes)
			})
	}

	const addPaletteToList = (palette) => {
		setPalettes([...palettes, palette])
	}

	useEffect(() => {
		getAllPalettes()
	}, [])

	return (
		<Wrapper className="App">
			<ViewSwitch onClick={ toggle }>{viewPalettes ? "Go Back" : "Go to Palettes"}</ViewSwitch>
			{viewPalettes ? <PalettesList palettes={palettes} /> : <ColorViewer newPalette={addPaletteToList} toggle={toggle} />}
		</Wrapper>
	)
  
}

export default App
