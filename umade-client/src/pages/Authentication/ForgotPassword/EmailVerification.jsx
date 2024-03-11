import { Box, Button, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

function Email({ setStep, reference, email, setEmail }) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	const [emailErrors, setEmailErrors] = useState('')
	const [isError, setIsError] = useState(false)
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
				cmd: 1,
				receiveEmail: email,
			})
			console.log(res.data)
			if (res.data.status === 0) {
				toast.success('Mã OTP đã được gửi thành công.')
				setTimeout(() => {
					reference.focus()
				}, 250)
				setStep(2)
			} else {
				toast.error('Gửi OTP thất bại, vui lòng kiểm tra lại email')
			}
		}
	}
	return (
		<Box component="form" onSubmit={handleSubmit} noValidate width="396px">
			<Typography variant="p">Nhập email của bạn để tiếp tục</Typography>
			<TextField
				error={isError}
				name="email"
				type="email"
				fullWidth
				label="Nhập email đăng nhập"
				margin="normal"
				required
				onChange={handleChange}
				autoFocus
				sx={{ marginTop: 4 }}
				helperText={emailErrors ? emailErrors : ' '}
				color={isError ? '' : 'primary'}
			></TextField>
			<Button type="submit" variant="contained" sx={{ width: '100%' }}>
				Xác nhận
			</Button>
		</Box>
	)
}
export default Email
