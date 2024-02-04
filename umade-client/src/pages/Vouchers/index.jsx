import {
	styled,
	Table,
	TableContainer,
	TableHead,
	TableBody,
	TableCell,
	Paper,
	TableRow,
	Card,
	CardHeader,
	Button,
	Modal,
	Box,
	Typography,
	TextField,
	InputAdornment,
	ButtonGroup,
} from '@mui/material'
import axios from 'axios'
import React from 'react'
import { toast } from 'react-toastify'

const StyledBox = styled(Card)(({ theme }) => ({
	width: '50%',
	height: '400px',
	margin: 'auto',
}))

const TitleTypography = styled(Typography)(({ theme }) => ({
	color: theme.palette.primary.main,
	borderColor: theme.palette.primary.main,
	borderLeft: '3px solid',
	paddingLeft: 20,
}))

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 500,
	bgcolor: 'background.paper',
	boxShadow: 24,
	borderRadius: 5,
	py: 3,
}

function AddingForm({ handleSubmit }) {
	const [values, setValues] = React.useState({})
	const [errors, setErrors] = React.useState({})
	const handleChange = (name) => (event) => {
		setValues({ ...values, [name]: event.target.value })
		setErrors({})
	}

	const submit = async (event) => {
		event.preventDefault()
		if (!values.name) {
			setErrors({ ...errors, name: 'Tên không hợp lệ' })
			return
		} else if (!values.sales) {
			setErrors({ ...errors, sales: 'Giảm giá không hợp lệ' })
			return
		}

		setValues({ ...values, sales: values.sales / 100 })
		await handleSubmit(values)
		setValues({})
	}

	return (
		<Box
			component="form"
			sx={{ width: '70%', mx: 'auto', pt: 3, textAlign: 'center' }}
			onSubmit={submit}
		>
			<TextField
				variant="outlined"
				label="Tên"
				sx={{ width: '100%', mb: 2 }}
				onChange={handleChange('name')}
				error={errors.name}
				helperText={errors.name}
			/>
			<TextField
				variant="outlined"
				type="number"
				label="Giảm giá"
				sx={{ width: '100%', mb: 2 }}
				onChange={handleChange('sales')}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">%</InputAdornment>
					),
				}}
				error={errors.sales}
				helperText={errors.sales}
			/>
			<Button type="submit" variant="contained">
				Thêm
			</Button>
		</Box>
	)
}

function DeleteForm({ keyID, handleDelete, handleClose }) {
	return (
		<Box component="form" sx={{ width: '90%', mx: 'auto', pt: 3 }}>
			<Typography>
				Bạn có chắc muốn xóa mã giảm giá{' '}
				<strong>
					<i>{keyID}</i>
				</strong>{' '}
				không?
			</Typography>
			<Box sx={{ textAlign: 'center' }}>
				<Box
					sx={{
						display: 'inline-flex',
						m: 1,
						'*': { mx: 2 },
						mx: 'auto',
					}}
				>
					<Button variant="contained" onClick={handleClose}>
						Không
					</Button>
					<Button variant="outlined" onClick={handleDelete}>
						Có
					</Button>
				</Box>
			</Box>
		</Box>
	)
}

function VouchersPage() {
	const cols = [
		{ field: 'id', headerName: 'ID' },
		{ field: 'name', headerName: 'Tên' },
		{ field: 'sales', headerName: 'Giảm giá' },
		{ field: 'createdDate', headerName: 'Được tạo lúc' },
		{ field: 'createdDate', headerName: 'Hành động' },
	]
	const [rows, setRows] = React.useState([])
	const [open, setOpen] = React.useState(false)
	const [deleteId, setDeleteId] = React.useState()
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const setRowsAsync = async () => {
		const rows = await axios.get('/api/vouchers', {})
		setRows(rows.data)
	}
	const handleSubmit = async (values) => {
		// console.log(values)
		handleClose()
		const res = await axios.post('/api/vouchers', values)
		if (res.data.status === 0) {
			toast.success('Đã thêm mã giảm giá!')
			setRowsAsync()
		} else {
			toast.error('Xảy ra lỗi trong quá trình thêm!')
		}
	}
	const closeDelete = () => {
		setDeleteId()
	}

	const handleDelete = async () => {
		const res = await axios.delete(`/api/vouchers?id=${deleteId}`)
		if (res.data.status === 0) {
			toast.success('Đã xóa mã giảm giá!')
			setRowsAsync()
		} else {
			toast.error('Xảy ra lỗi trong quá trình xóa!')
		}
		closeDelete()
	}

	React.useEffect(() => {
		setRowsAsync()
	}, [])

	return (
		<Box>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
			>
				<Box sx={style}>
					<TitleTypography id="modal-modal-title" variant="h4">
						Thêm mã giảm giá
					</TitleTypography>
					<AddingForm handleSubmit={handleSubmit} />
				</Box>
			</Modal>
			<Modal
				open={!!deleteId}
				onClose={closeDelete}
				aria-labelledby="modal-modal-title"
			>
				<Box sx={style}>
					<TitleTypography id="modal-modal-title" variant="h4">
						Xóa mã giảm giá
					</TitleTypography>
					<DeleteForm
						keyID={deleteId}
						handleDelete={handleDelete}
						handleClose={closeDelete}
					/>
				</Box>
			</Modal>
			<StyledBox>
				<CardHeader
					action={
						<Button
							variant="contained"
							color="primary"
							onClick={handleOpen}
						>
							Thêm
						</Button>
					}
					title="Mã giảm giá"
				/>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								{cols.map((val, ind) => (
									<TableCell key={ind}>
										{val.headerName}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map(
								(val, ind) =>
									!val.deletedDate && (
										<TableRow key={ind}>
											<TableCell>{val.id}</TableCell>
											<TableCell>{val.name}</TableCell>
											<TableCell>{val.sales}%</TableCell>
											<TableCell>
												{val.createdDate}
											</TableCell>
											<TableCell>
												<Button
													variant="text"
													onClick={() =>
														setDeleteId(val.id)
													}
												>
													Xóa
												</Button>
											</TableCell>
										</TableRow>
									),
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</StyledBox>
		</Box>
	)
}

export default VouchersPage
