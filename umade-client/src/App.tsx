import React from 'react'
import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import VouchersPage from './pages/Vouchers'
import SignUpPage from './pages/Authentication/signUp'
import { ThemeProvider, createTheme } from '@mui/material'
import { green, orange, purple, red, yellow } from '@mui/material/colors'
import ChangePassword from './pages/UserSetting/ChangePassword'

const theme = createTheme({
	palette: {
		primary: purple,
		secondary: orange,
		error: red,
		warning: yellow,
		info: green,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				outlined: {
					borderWidth: '2px',
					'&:hover': {
						borderWidth: '2px',
					},
				},
			},
		},
	},
})

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Routes>
					<Route path="/" />
					<Route path="/vouchers" Component={VouchersPage} />
					<Route path="/signUp" Component={SignUpPage} />
					<Route path="/changePassword" Component={ChangePassword} />
				</Routes>
			</Router>
		</ThemeProvider>
	)
}

export default App
