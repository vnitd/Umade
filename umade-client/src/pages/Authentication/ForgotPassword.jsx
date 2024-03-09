import {
	Button,
	CssBaseline,
	TextField,
	Box,
	Typography,
	Container,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Paper from '@mui/material/Paper'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'
import { redirect, useHistory } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
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

function ForgotPassword() {
	const navigate = useNavigate();
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const [email, setEmail] = useState('')
	const [emailErrors, setEmailErrors] = useState('')
	const [isError, setIsError] = useState(false)
	const paperStyle = {
		padding: 20,
		height: '550px',
		width: 1000,
		margin: '50px auto',
	}
	useEffect(() => {
		setEmail(email)
	})
	const validateInput = (field, value) => {
		let isError = false
		let message = ''
		if (field === 'email' && !emailRegex.test(value)) {
			isError = true
			message = 'Email không hợp lệ'
		}
		setIsError(isError)
		setEmailErrors(message)
	}
	const handleChange = (event) => {
		setEmail(event.target.value)
		validateInput(event.target.name, event.target.value)
	}
	const validateOnSubmit = () => {
		let messages = emailErrors
		let isErrors = isError

		if (!email) {
			messages = 'Không bỏ trống ô này'
			isErrors = true
		}

		return { messages, isErrors }
	}
	const handleSubmit = async (event) => {
		event.preventDefault()
		const { messages, isErrors } = validateOnSubmit()

		if (Object.values(messages).some((v) => v !== '' || v)) {
			setIsError(isErrors)
			setEmailErrors(messages)
			return
		} else {
			const res = await axios.post('api/forgotPassword', {
				receiveEmail: email,
			})
			console.log(res.data)
			if (res.data.status === 0) {
				toast.success('Mã OTP đã được gửi thành công. Chờ 3s chuyển đến trang xác thực')
				setTimeout (()=>{
					navigate("/otpForm")
				}, 1000)
				
			} else {
				toast.error('Gửi OTP thất bại, vui lòng kiểm tra lại email')
			}
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
					<Box
						p={7}
						component="form"
						onSubmit={handleSubmit}
						noValidate
					>
						
						<Typography variant="h3" gutterBottom>
							Đổi mật khẩu
						</Typography>
						<Typography fontSize={25} gutterBottom>
							Để lấy lại mật khẩu, vui lòng điền email dùng để
							đăng nhập vào ô dưới!
						</Typography>
						<Typography gutterBottom>
							Mã OTP để thay đổi mật khẩu sẽ được gửi về hòm thư
							email của bạn
						</Typography>
						<TextField
							error={isError}
							name="email"
							type="email"
							fullWidth
							label="Nhập email đăng nhập"
							margin="normal"
							required
							gutterBottom
							onChange={handleChange}
							autoFocus
							style={{ marginBottom: '20px' }}
							helperText={emailErrors ? emailErrors : ' '}
							color={isError ? '' : 'success'}
						></TextField>
						<Button
							type="submit"
							variant="contained"
							// onClick ={() => navigate('/otpForm')}
							startIcon={<SendIcon></SendIcon>}
						>
							Gửi OTP
						</Button>
					</Box>
				</Paper>
			</CssBaseline>
			<Copyright sx={{ mt: 5 }} />
		</Container>
	)
}

export default ForgotPassword
