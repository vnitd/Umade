import React from 'react'
import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import VouchersPage from './pages/Vouchers'
import SignUpPage from './pages/Authentication/signUp'
import { ThemeProvider, createTheme } from '@mui/material'
import { green, orange, purple, red, yellow } from '@mui/material/colors'
import ChangePassword from './pages/UserSetting/ChangePassword'
import ForgotPassword from './pages/Authentication/ForgotPassword'
import OTPForm from './pages/Authentication/OTPForm'
import ResetPassword from './pages/Authentication/ResetPassword'
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
					<Route path="/forgotPassword" Component={ForgotPassword} />
					<Route path="/otpForm" Component={OTPForm} />
					<Route path="/resetPassword" Component={ResetPassword} />

				</Routes>
			</Router>
		</ThemeProvider>
	)
}

export default App
