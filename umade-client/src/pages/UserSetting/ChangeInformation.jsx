import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Box,
	Typography,
	Container,
	Grid,
	useTheme,
	FormControl,
	MenuItem
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
//Footer copyright
function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{'Copyright © '}
			<Link color="inherit" href="https://mui.com/">
				@Umade
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	)
}

export default function ChangeInformation(){
	const [cookie, setCookie] = useCookies(['userData'])
	const [userData, setUserData] = useState(cookie);
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const phoneRegex = /^0\d{9,10}$/
	const navigateTo = useNavigate()
	const theme = useTheme()
	const [values, setValues] = useState({
		name: '',
		email: '',
		phone: '',
		gender: '',
		address: '',
	})
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		phone: '',
		gender: '',
	})
	const [isError, setIsError] = useState({
		name: false,
		email: false,
		phone: false,
		gender: false,
	})

	const validateInput = (field, value) => {
		let isError = false
		let message = ''
		if (field === 'email' && !emailRegex.test(value)) {
			isError = true
			message = 'Email không hợp lệ'
		} else if (field === 'phone' && !phoneRegex.test(value)) {
			isError = true
			message = 'Số điện thoại không hợp lệ'
		}
		setIsError({...isError, [field]: isError})
		setErrors({
			...errors,
			[field]: message,
		})
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		const data = new FormData(event.target.currentTarget)

		const updatedUserData = {
			name: data.get('name'),
			phone: data.get('phone'),
			email: data.get('email'),
			address: data.get('address'),
			gender: data.get('gender')
		};

		setValues(updatedUserData);
		setCookie('userData', updatedUserData);

		try{
			const resp = await axios.put('http://localhost:8080/api/updateUserInfo', updatedUserData);

			console.log(resp.data);
			console.log(resp.data.status);
			if (resp.data.status !== 1) {
				toast.success('Cập nhật thông tin thành công');
			} else {
				toast.error('Cập nhật thông tin thất bại, vui lòng thử lại');
			}
	
		}catch(error){
			console.error('Error: ', error);
			toast.error('Đã xảy ra lỗi, vui lòng thử lại sau');
		}
	}
	const handleChange = (event) => {
		setValues({...values, [event.target.name]: event.target.value})
		validateInput(event.target.name, event.target.value)
	}
    return(
		<Container component="main" maxWidth="xs">
			<CssBaseline/>
			<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
			}}>
				<Avatar sx={{ m : 1, bgcolor: theme.palette.primary.main}}>
				</Avatar>
				<Typography component="h1" variant="h5">
					Chỉnh sửa thông tin
				</Typography>
				<Box component = "form"
					noValidate
					onSubmit={handleSubmit}
					sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								error={isError.name}
								autoComplete="given-name"
								name="name"
								required
								fullWidth
								label="Tên đầy đủ"
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
						<Grid item xs={4}>
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
						<Grid item xs={8}>
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
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Lưu thông tin
					</Button>
				</Box>
			</Box>
		</Container>
	)
}