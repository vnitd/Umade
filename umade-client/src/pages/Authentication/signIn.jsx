import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Grid,
	Box,
	Typography,
	Container,
	useTheme,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
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

function SignInPage() {
	const [values, setValues] = useState({
		email: '',
		password: '',
	})
	const [errors, setErrors] = useState({
		email: '',
		password: '',
	})
	const [isError, setIsError] = useState({
		email: false,
		password: false,
	})
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const navigateTo = useNavigate()
	const theme = useTheme()

	const validateInput = (field, value) => {
		let isError = false
		let message = ''

		if (field === 'email' && !emailRegex.test(value)) {
			isError = true
			message = 'Email không hợp lệ'
		} else if (field === 'password' && value.length <= 8) {
			isError = true
			message = 'Mật khẩu phải nhiều hơn 8 ký tự'
		}

		setIsError({ ...isError, [field]: isError })
		setErrors({
			...errors,
			[field]: message,
		})
	}

	const handleChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value })
		validateInput(event.target.name, event.target.value)
	}

	const validateOnSubmit = () => {
		let messages = { ...errors }
		let isErrors = { ...isError }
		Object.keys(values).forEach((field) => {
			if (!values[field]) {
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
			setErrors(messages)
			return
		} else {
			const res = await axios.post('api/signIn', values)
			if (res.data.status === 0) {
				toast.success('Đăng nhập thành công')
				navigateTo('/')
			} else {
				toast.error(res.data.result)
			}
		}
	}

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Chào mừng đến với Umade
				</Typography>
				<Box
					component="form"
					noValidate
					onSubmit={handleSubmit}
					sx={{ mt: 3 }}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								error={isError.email}
								autoComplete="given-email"
								name="email"
								type="email"
								label="Email"
								required
								fullWidth
								onChange={handleChange}
								helperText={errors.email ? errors.email : ' '}
								color={isError.email ? '' : 'success'}
							/>
						</Grid>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Typography variant="body1">
									<Link to="/forgot-password">
										Quên mật khẩu?
									</Link>
								</Typography>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<TextField
								autoComplete="given-password"
								error={isError.password}
								name="password"
								label="Mật khẩu"
								type="password"
								onChange={handleChange}
								helperText={
									errors.password ? errors.password : ' '
								}
								color={isError.password ? '' : 'success'}
								required
								fullWidth
							/>
						</Grid>
					</Grid>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Đăng nhập
					</Button>
				</Box>
				<Typography variant="body1">
					Chưa có tài khoản? Đi tới&nbsp;
					<Link to="/sign-up">Đăng ký</Link>
				</Typography>
			</Box>
			<Copyright sx={{ mt: 5 }} />
		</Container>
	)
}
export default SignInPage
