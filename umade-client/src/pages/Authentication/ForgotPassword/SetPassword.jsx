import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'

import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

import { toast } from 'react-toastify'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

function SetPassword({ email }) {
	const navigateTo = useNavigate()
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')

	const handleMouseDownPassword = (event) => {
		event.preventDefault()
	}

	const handleEdit = (event) => {
		const value = event.target.value
		setPassword(value)
		if (value.length <= 8) {
			setError('Mật khẩu phải nhiều hơn 8 ký tự')
		} else if (value.length > 8) {
			setError('')
		}
	}

	const handleSubmit2 = async (event) => {
		event.preventDefault()
		event.target.disabled = true
		if (error) {
			toast.error(error)
			return
		}

		const timeout = setTimeout(() => {
			event.target.disabled = false
			clearTimeout(timeout)
		}, 2000)
		var res = (
			await axios.post('api/forgotPassword', {
				cmd: 3,
				password,
				email,
			})
		).data
		if (res.status === 0) {
			toast.success('Khôi phục mật khẩu thành công!')
			setTimeout(() => {
				navigateTo('/sign-in')
			}, 1000)
		} else {
			toast.error(res.result)
		}
	}

	return (
		<div className="step">
			<Box sx={{ mb: 6 }}>
				<Typography variant="body2">
					Hãy nhập mật khẩu mới của bạn!
				</Typography>
			</Box>
			<form noValidate autoComplete="off" onSubmit={handleSubmit2}>
				<FormControl fullWidth>
					<InputLabel htmlFor="auth-login-password">
						Mật khẩu
					</InputLabel>
					<OutlinedInput
						label="Password"
						value={password}
						id="auth-login-password"
						onChange={handleEdit}
						type={showPassword ? 'text' : 'password'}
						sx={{ marginBottom: 4 }}
						color={error ? '' : 'primary'}
						helperText={error}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									edge="end"
									onClick={() => {
										setShowPassword(!showPassword)
									}}
									onMouseDown={handleMouseDownPassword}
									aria-label="toggle password visibility"
								>
									{showPassword ? (
										<EyeOutline />
									) : (
										<EyeOffOutline />
									)}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>

				<Button
					fullWidth
					size="large"
					variant="contained"
					type="submit"
				>
					Xác nhận
				</Button>
			</form>
		</div>
	)
}

export default SetPassword
