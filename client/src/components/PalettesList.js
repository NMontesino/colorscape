import styled from 'styled-components'


const Container = styled.div`
	width: 85vw;
	height: 80vh;
	border: 1px solid black;
	overflow: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Palette = styled.div`
	background: #fff;
	height: 30vh;
	width: 35vw;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	padding: 24px 16px;
	box-sizing: border-box;
`

const ColorSquare = styled.div`
	height: 50px;
	width: 75px;
	flex: 1;
	background: #${(props) => props.color};
	border: 1px solid black;
	margin: 8px;
`

const PaletteColors = styled.div`
	width: calc(100% - 24px);
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 12px;
`


const PalettesList = (props) => {

    const { palettes } = props

    if (palettes.length > 0) {
        return (
			<Container id="paletteContainer">
				{[...palettes].reverse().map((palette) => {
					return (
						<Palette>
                            <h1>{palette.name}</h1>
                            <PaletteColors>
                                {palette.colors.map((color) => {
                                    return <ColorSquare color={color.hex} />
                                })}
                            </PaletteColors>
						</Palette>
					)
				})}
			</Container>
		)
    }

}


export default PalettesList