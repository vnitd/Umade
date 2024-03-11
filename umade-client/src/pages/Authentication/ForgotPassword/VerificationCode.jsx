import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import axios from 'axios'
import './VerificationCode.scss'

const OtpInput = styled('input')(({ theme }) => ({
	outlineColor: theme.palette.primary.main,
}))

function VerificationCode({ setStep, setRef, email }) {
	const clearOutput = () => {
		const numberCodeForm = document.querySelector('[data-number-code-form]')
		const numberCodeInputs = [
			...numberCodeForm.querySelectorAll('[data-number-code-input]'),
		]

		numberCodeInputs.forEach((val) => {
			val.value = ''
		})
		numberCodeInputs[0].focus()
	}

	const handleInputOtp = async ({ target }) => {
		const numberCodeForm = document.querySelector('[data-number-code-form]')
		const numberCodeInputs = [
			...numberCodeForm.querySelectorAll('[data-number-code-input]'),
		]
		if (!target.value.length) {
			return (target.value = null)
		}

		const inputLength = target.value.length
		let currentIndex = Number(target.dataset.numberCodeInput)

		if (inputLength > 1) {
			const inputValues = target.value.split('')

			inputValues.forEach((value, valueIndex) => {
				const nextValueIndex = currentIndex + valueIndex

				if (nextValueIndex >= numberCodeInputs.length) {
					return
				}

				numberCodeInputs[nextValueIndex].value = value
			})

			currentIndex += inputValues.length - 2
		}

		const nextIndex = currentIndex + 1

		if (nextIndex < numberCodeInputs.length) {
			numberCodeInputs[nextIndex].focus()
		}

		var data = ''
		numberCodeInputs.forEach((input) => {
			data += input.value
		})
		if (data.length === 6) {
			const res = (
				await axios.post('api/forgotPassword', {
					cmd: 2,
					code: data,
					email,
				})
			).data
			if (res.status === 0) {
				setStep(3)
			} else {
				clearOutput()
				toast.error('Sai mã xác nhận')
			}
		}
	}

	const handleKeyDown = (e) => {
		const numberCodeForm = document.querySelector('[data-number-code-form]')
		const numberCodeInputs = [
			...numberCodeForm.querySelectorAll('[data-number-code-input]'),
		]
		const { code, target } = e

		const currentIndex = Number(target.dataset.numberCodeInput)
		const previousIndex = currentIndex - 1
		const nextIndex = currentIndex + 1

		const hasPreviousIndex = previousIndex >= 0
		const hasNextIndex = nextIndex <= numberCodeInputs.length - 1

		switch (code) {
			case 'ArrowLeft':
			case 'ArrowUp':
				if (hasPreviousIndex) {
					numberCodeInputs[previousIndex].focus()
				}
				e.preventDefault()
				break

			case 'ArrowRight':
			case 'ArrowDown':
				if (hasNextIndex) {
					numberCodeInputs[nextIndex].focus()
				}
				e.preventDefault()
				break
			case 'Backspace':
				if (!e.target.value.length && hasPreviousIndex) {
					numberCodeInputs[previousIndex].value = null
					numberCodeInputs[previousIndex].focus()
				}
				break
			default:
				break
		}
	}

	return (
		<div className="step">
			<Box sx={{ mb: 6 }}>
				<Typography
					variant="h6"
					sx={{ fontWeight: 600, marginBottom: 1.5 }}
				>
					Đã gửi mã xác minh
				</Typography>
				<Typography variant="body2">
					Vui lòng kiểm tra hộp thư điện tử
				</Typography>
			</Box>
			<form
				noValidate
				autoComplete="off"
				onSubmit={(e) => {
					e.preventDefault()
				}}
			>
				<fieldset
					name="number-code"
					data-number-code-form
					style={{ border: 'none' }}
					onInput={handleInputOtp}
					onKeyDown={handleKeyDown}
				>
					<legend style={{ fontSize: 0 }}>Number Code</legend>
					{/* <TextField className={classes.input} /> */}
					<OtpInput
						className="otp-code"
						type="number"
						min="0"
						max="9"
						name="number-code-0"
						data-number-code-input="0"
						required
						ref={(ref) => setRef(ref)}
					/>
					<OtpInput
						className="otp-code"
						type="number"
						min="0"
						max="9"
						name="number-code-1"
						data-number-code-input="1"
						required
					/>
					<OtpInput
						className="otp-code"
						type="number"
						min="0"
						max="9"
						name="number-code-2"
						data-number-code-input="2"
						required
					/>
					<OtpInput
						className="otp-code"
						type="number"
						min="0"
						max="9"
						name="number-code-3"
						data-number-code-input="3"
						required
					/>
					<OtpInput
						className="otp-code"
						type="number"
						min="0"
						max="9"
						name="number-code-4"
						data-number-code-input="4"
						required
					/>
					<OtpInput
						className="otp-code"
						type="number"
						min="0"
						max="9"
						name="number-code-5"
						data-number-code-input="5"
						required
					/>
				</fieldset>
				{/* <Button fullWidth size='large' variant='contained' type='submit' sx={{ marginBottom: 7 }}>
												Next
											</Button> */}
			</form>
		</div>
	)
}

export default VerificationCode
