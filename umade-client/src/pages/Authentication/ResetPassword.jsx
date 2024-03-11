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
import { toast } from 'react-toastify'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Paper from '@mui/material/Paper'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'
function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{'Copyright © by KST ' + new Date().getFullYear() + '.'}
		</Typography>
	)
}

function ResetPassword() {
	const [newPassword, setNewPassword] = useState('')
	const [value, setValue] = useState({
		newPassword: '',
		renewPassword: '',
	})
	const [error, setError] = useState({
		newPassword: '',
		renewPassword: '',
	})
	const [isError, setIsError] = useState({
		newPassword: false,
		renewPassword: false,
	})
	const paperStyle = {
		padding: 20,
		height: '600px',
		width: 500,
		margin: '50px auto',
	}
	const validateInput = (field, value) => {
		let message = ''
		let isError = false

		if (field == 'newPassword' && value.length <= 8) {
			isError = true
			message = 'Mật khẩu phải nhiều hơn 8 ký tự'
		} else if (field == 'newPassword' && value.length > 8) {
			setNewPassword(value)
		} else if (field == 'renewPassword' && value !== newPassword) {
			console.log(newPassword)
			isError = true
			message = 'Mật khẩu không khớp với mật khẩu đã nhập'
		}
		setIsError({ ...isError, [field]: isError })
		setError({
			...error,
			[field]: message,
		})
	}
	const handleChange = (event) => {
		setValue({ ...value, [event.target.name]: event.target.value })
		validateInput(event.target.name, event.target.value)
	}
	const validateOnSubmit = () => {
		let messages = { ...error }
		let isErrors = { ...isError }
		Object.keys(value).forEach((field) => {
			if (!value[field]) {
				messages = { ...messages, [field]: 'Không bỏ trống ô này' }
				isErrors = { ...isErrors, [field]: true }
			}
		})

		return { messages, isErrors }
	}
	const handleSubmit = async (event) => {
		event.preventDefault()
		const { messages, isErrors } = validateOnSubmit()
		if (Object.values(messages).some((v) => v !== '' || v)) {
			setIsError(isErrors)
			setError(messages)
			return
		} else {
			const res = await axios.post('api/newPassword', value)
			if (res.data.status === 0) {
				toast.success('Thay đổi mật khẩu thành công')
			} else {
				toast.error('Xảy ra lỗi, vui lòng thử lại')
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
						p={5}
						component="form"
						onSubmit={handleSubmit}
						noValidate
					>
						<Grid
							container
							direction="column"
							alignItems="center"
							justify="center"
						>
							<Typography
								variant="h4"
								style={{ marginBottom: '50px' }}
							>
								Đặt lại mật khẩu
							</Typography>
							<TextField
								type="password"
								error={isError.newPassword}
								required
								fullWidth
								autoFocus
								onChange={handleChange}
								name="newPassword"
								label="Mật khẩu mới"
								style={{ marginBottom: '20px' }}
								helperText={
									error.newPassword ? error.newPassword : ' '
								}
								color={isError.newPassword ? '' : 'success'}
							></TextField>
							<TextField
								error={isError.renewPassword}
								type="password"
								fullWidth
								name="renewPassword"
								label="Xác nhận lại mật khẩu"
								style={{ marginBottom: '30px' }}
								onChange={handleChange}
								helperText={
									error.renewPassword
										? error.renewPassword
										: ' '
								}
								color={isError.renewPassword ? '' : 'success'}
							></TextField>
							<Button
								type="submit"
								variant="contained"
								startIcon={<SendIcon></SendIcon>}
							>
								Đổi mật khẩu
							</Button>
						</Grid>
					</Box>
				</Paper>
			</CssBaseline>
			<Copyright sx={{ mt: 5 }} />
		</Container>
	)
}
export default ResetPassword
