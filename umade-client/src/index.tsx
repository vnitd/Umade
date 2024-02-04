import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
axios.defaults.headers.post['Content-Type'] =
	'application/x-www-form-urlencoded'
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded'

root.render(
	<React.StrictMode>
		<ToastContainer />
		<App />
	</React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
