import axios from "axios"

const api = axios.create({
	baseURL: "https://colorscape-api.herokuapp.com/"
})

export default api
