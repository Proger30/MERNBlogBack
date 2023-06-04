
import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';


export const getAuthMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);
		if (!user) {
			return res.status(404).json({
				message: 'No such user'
			})
		}
		
		const { passwordHash, ...userDoc} = user._doc
		
		res.json(userDoc);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Can not get access :('
		}); 
	}
};

export const postAuthLogin = async (req, res) => {
	try{
		const user = await UserModel.findOne({email: req.body.email});
		if (!user) {
			return res.status(404).json({
				message: 'User not found!'
			});
		}
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		
		if (!isValidPass) {
			return res.json({
				message: 'does not logged in'
			})
		}

		const token = jwt.sign({
			_id: user._id
		}, 'secret123', {
			expiresIn: '30d'
		})

		const { passwordHash, ...userDoc} = user._doc
		return res.json({
			...userDoc,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Can not log in :('
		}); 
	}
};

export const postAuthRegister = async (req, res) => {
	try {
		// const token = jwt.sign({
		// 	email: req.body.email,
		// 	fullName: 'Вася Пупкин',
		// 	password: req.body.password,
		// }, 'secret123');
		const salt = bcrypt.genSaltSync(10);
		const password = bcrypt.hashSync(req.body.password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			passwordHash: password,
			avatarUrl: req.body.avatarUrl,
		});
		const user = await doc.save();

		const token = jwt.sign({
			_id: user._id
		}, 'secret123', {
			expiresIn: '30d'
		})

		const { passwordHash, ...userDoc} = user._doc

		res.json({
			...userDoc,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Can not register :('
		}); 
	};
};
