import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import authRouter from './router/auth.js'
import postRouter from './router/post.js'
import isAuth from './util/isAuth.js';

mongoose.connect('mongodb+srv://root:yIoxtV6PXJ0HQomW@project0.aouf6am.mongodb.net/blogFullStack?retryWrites=true&w=majority')
	.then(() => {
		console.log('DB connect');
	})
	.catch(err => {
		console.log('DB error', err);
	});

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage });
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.post('/upload', isAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});


app.use('/auth', authRouter);
app.use('/post', postRouter);

app.listen(3030, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log("Server OK");
});
