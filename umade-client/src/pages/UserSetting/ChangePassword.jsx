import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Box,
	Typography,
	Container,
	useTheme,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

//Footer copyright
function Copyright(props) {
	return (
	  <Typography variant="body2" color="text.secondary" align="center" {...props}>
		{'Copyright © '}
		<Link color="inherit" href="https://mui.com/">
		  @Umade
		</Link>{' '}
		{new Date().getFullYear()}
		{'.'}
	  </Typography>
	);
  }
  
  export default function ChangePassword() {

	const theme = useTheme()
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const [values, setValues] = useState({
		email: '',
		oldPassword: '',
		newPassword: '',
	})

	const [error, setError] = useState({
		email: '',
		oldPassword: '',
		newPassword: '',
		renewPassword: '',
	})
	const [isError, setIsError] = useState({
		email: false,
		oldPassword: false,
		newPassword: false,
		renewPassword: false,

	})
	const [newPassword, setNewPassword] = useState('');
	const validateInput = (field, value) => {
		let message =''
		let isError = false
		if(field == 'email' && !emailRegex.test(value)){
			isError = true
			message = 'Email không hợp lệ!'
		} else if(field == 'oldPassword' && value.length <=8){
			isError = true
			message = 'Mật khẩu cần nhiều hơn 8 kí tự'
		} else if(field == 'newPassword' && value.length <=8){
			isError = true
			message = 'Mật khẩu cần nhiều hơn 8 kí tự'
		}else if(field == 'newPassword' && value.length >8){
			setNewPassword(value)
		}
		else if(field == 'renewPassword' && value !== newPassword){
			isError = true
			message = 'Mật khẩu nhập lại không khớp'
		}
		setIsError({ ...isError, [field]: isError })
		setError({
			...error,
			[field]: message,
		})
	}

	const handleChange = (event) => {
		setValues({...values, [event.target.name]: event.target.value})
		validateInput(event.target.name, event.target.value)
	
	}
	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const resp = await axios.put(`api/changePassword?email=${data.get('email')}&oldPassword=${data.get('oldPassword')}&newPassword=${data.get('newPassword')}`)
		console.log(resp.data)
		console.log(resp.data.status)
		if(resp.data.status !== 1){
			toast.success('Đổi mật khẩu thành công')
		}
		else{
			toast.error('Đổi mật khẩu thất bại, vui lòng thử lại')
		}
	};
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
			  Đổi mật khẩu
			</Typography>
			<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
				error = {isError.email}
				margin="normal"
				required
				fullWidth
				label="Nhập email"
				name="email"
				type="text"
				autoFocus
				onChange={handleChange}
				helperText={error.email ? error.email : ' '}
				color={isError.email ? '' : 'success'}
			  />
              <TextField
			  	error = {isError.oldPassword}
				margin="normal"
				required
				fullWidth
				label="Nhập mật khẩu cũ"
				name="oldPassword"
				type="password"
				onChange={handleChange}
				helperText={
					error.oldPassword ? error.oldPassword : ' '
				}
				color={isError.oldPassword ? '' : 'success'}
				
			  />
			  <TextField
			  	error = {isError.newPassword}
				margin="normal"
				required
				fullWidth
				name="newPassword"
				label="Nhập mật khẩu mới"
				type="password"
				onChange={handleChange}
				helperText = {
					error.newPassword ? error.newPassword : ' '
				}
				color = {isError.newPassword ? '' : 'success'}
			  />
			  <TextField
				error = {isError.renewPassword}
				margin="normal"
				required
				fullWidth
				name="renewPassword"
				label="Nhập lại mật khẩu mới"
				type="password"
				onChange={handleChange}
				helperText = {
					error.renewPassword ? error.renewPassword : ' '
				}
				color={isError.renewPassword ? '' : 'success'}
			  />
			  <Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
			  >
				Đổi mật khẩu
			  </Button>
			</Box>
		  </Box>
		  <Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
  }