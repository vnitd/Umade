import { Box, Typography, Container } from '@mui/material'
import { useState } from 'react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Email from './EmailVerification'
import VerificationCode from './VerificationCode'
import SetPassword from './SetPassword'
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

const stepStyle = {
	width: '300%',
	display: 'flex',
	transition: '0.225s all ease-in-out',
}

function ForgotPassword() {
	const [step, setStep] = useState(1)
	const [ref, setRef] = useState()
	const [email, setEmail] = useState('')

	return (
		<Container maxWidth="xs">
			<Box display="flex" justifyContent="center" alignItems="center">
				<img src="./img/Picture1.png" width={180} height={110} alt="" />
			</Box>
			<Typography variant="h4" p={0} m={0}>
				Khôi phục mật khẩu
			</Typography>
			<Box className="slider" width="396px" sx={{ overflow: 'hidden' }}>
				<Box
					className="slide"
					sx={{
						...stepStyle,
						ml: -(step - 1) * 100 + '%',
					}}
				>
					<Email
						setStep={setStep}
						reference={ref}
						email={email}
						setEmail={setEmail}
					/>
					<VerificationCode
						setRef={setRef}
						setStep={setStep}
						email={email}
					/>
					<SetPassword email={email} />
				</Box>
			</Box>
			<Copyright sx={{ mt: 5 }} />
		</Container>
	)
}

export default ForgotPassword
