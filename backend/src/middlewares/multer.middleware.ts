import multer, { Multer } from 'multer'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	},
})

export const upload: Multer = multer({ storage })
