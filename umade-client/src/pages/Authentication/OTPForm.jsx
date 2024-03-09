import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Grid,
	Box,
	Typography,
	Container,
	MenuItem,
	FormControl,
	useTheme,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { orange } from '@mui/material/colors'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import SendIcon from '@mui/icons-material/Send'
function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{'Copyright © by Umade ' + new Date().getFullYear() + '.'}
		</Typography>
	)
}

function OTPForm() {
	const [OTP, setOTP] = useState('')
	const navigate = useNavigate()
	const paperStyle = {
		padding: 20,
		height: '450px',
		width: 500,
		margin: '50px auto',
	}
	const handleChange = (event) => {
		setOTP(event.target.value)
	}
	const handleOTP = async(event) => {
		event.preventDefault()
		const res = await axios.post('api/validateOTP', {
			otp: OTP,
		})
		console.log(res.data)
		if (res.data.status === 0) {
			toast.success('Mã OTP chính xác')
			setTimeout (()=>{
				navigate("/resetPassword")
			}, 1000)
		} else {
			toast.error('Mã OTP không chính xác')
		}
	}
	
	return (
		<Container>
			<CssBaseline>
				<Paper elevation={10} style={paperStyle}>
					<Box
						
						display="flex"
						justifyContent="center"
						alignItems="center"
					>
						<img
							src="./img/Picture1.png"
							width={180}
							height={110}
							alt=""
						/>
					</Box>
					<Box p={5} component='form'
						onSubmit={handleOTP}
						noValidate>
						<Grid
							container
							direction="column"
							alignItems="center"
							justify="center"
						>
							<Typography
								variant="h6"
								gutterBottom
							>
								Xác thực mã OTP
							</Typography>
							<TextField
								type="text"
								onChange={handleChange}
								autoFocus
								label="Nhập mã OTP"
								style={{ marginBottom: '20px' }}
							></TextField>
							<Button
								type="submit"
								variant="contained"
								startIcon={<SendIcon></SendIcon>}
							>
								Gửi OTP
							</Button>
						</Grid>
					</Box>
				</Paper>
			</CssBaseline>
			<Copyright sx={{ mt: 5 }} />
		</Container>
	)
}

export default OTPForm
