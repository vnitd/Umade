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

function SignUpPage() {
	const [values, setValues] = useState({
		name: '',
		email: '',
		password: '',
		phone: '',
		gender: '',
		defectType: '',
		address: '',
	})
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
		phone: '',
		gender: '',
		defectType: '',
	})
	const [isError, setIsError] = useState({
		name: false,
		email: false,
		password: false,
		phone: false,
		gender: false,
		defectType: '',
	})
	const emailRegex = /^(?!.*[.]{2})[a-zA-Z0-9._%+-]+@(?:(?!.*[.]{2})[a-zA-Z0-9.-])+[a-zA-Z]{2,}$/
	const phoneRegex = /^0\d{9}$/
	const navigateTo = useNavigate()
	const theme = useTheme()

	const validateInput = (field, value) => {
		let isError = false
		let message = ''

		if (field === 'name' && value.length === 0) {
			isError = true
			message = 'Không bỏ trống ô này'
		} else if (field === 'password' && value.length <= 8) {
			isError = true
			message = 'Mật khẩu phải nhiều hơn 8 ký tự'
		} else if (field === 'email' && !emailRegex.test(value)) {
			isError = true
			message = 'Email không hợp lệ'
		} else if (field === 'phone' && !phoneRegex.test(value)) {
			isError = true
			message = 'Số điện thoại không hợp lệ'
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
		console.log(values)
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
			const res = await axios.post('api/signUp', values)
			if (res.data.status === 0) {
				toast.success(
					'Đăng ký thành công! Vui lòng đăng nhập để sử dụng',
				)
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
								error={isError.name}
								autoComplete="given-name"
								name="name"
								required
								fullWidth
								label="Tên tài khoản"
								type="text"
								autoFocus
								onChange={handleChange}
								helperText={errors.name ? errors.name : ' '}
								color={isError.name ? '' : 'success'}
							/>
						</Grid>
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
						<Grid item xs={12}>
							<TextField
								error={isError.phone}
								required
								fullWidth
								name="phone"
								label="Số điện thoại"
								type="tel"
								onChange={handleChange}
								helperText={errors.phone ? errors.phone : ' '}
								color={isError.phone ? '' : 'success'}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={isError.address}
								fullWidth
								required
								name="address"
								label="Địa chỉ"
								type="text"
								autoComplete="address"
								onChange={handleChange}
								helperText={
									errors.address ? errors.address : ' '
								}
								color={isError.address ? '' : 'success'}
							/>
						</Grid>
						<Grid item xs={6}>
							<FormControl fullWidth>
								<TextField
									id="gender-select"
									select
									label="Giới tính"
									name="gender"
									value={values.gender}
									onChange={handleChange}
									fullWidth
									required
									helperText={
										errors.gender ? errors.gender : ' '
									}
									error={isError.gender}
								>
									<MenuItem value="male">Nam</MenuItem>
									<MenuItem value="female">Nữ</MenuItem>
									<MenuItem value="other">Khác</MenuItem>
								</TextField>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl fullWidth>
								<TextField
									id="defect-select"
									select
									label="Khiếm khuyết"
									name="defectType"
									value={values.defectType}
									onChange={handleChange}
									fullWidth
									required
									helperText={
										errors.defectType
											? errors.defectType
											: ' '
									}
									error={isError.defectType}
								>
									<MenuItem value="none">Không</MenuItem>
									<MenuItem value="arm disabled">
										Khuyết tật tay
									</MenuItem>
									<MenuItem value="other">Khác</MenuItem>
								</TextField>
							</FormControl>
						</Grid>
					</Grid>
					<Grid container justifyContent="flex-end">
						<Grid item>
							{/* Redirect to Sign In page*/}
							<Typography variant="body1">
								Đã có tài khoản?<Link to="/">Đăng nhập</Link>
							</Typography>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Đăng ký
					</Button>
				</Box>
			</Box>
			<Copyright sx={{ mt: 5 }} />
		</Container>
	)
}

export default SignUpPage
