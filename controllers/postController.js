import jwt from 'jsonwebtoken';
import PostModel from '../models/Post.js';
import mongoose from 'mongoose';


export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const lastTags = posts.map(obj => obj.tags).flat().slice(0, 5);

		return res.json(lastTags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Can not get all posts :('
		}); 
	}
};


export const getAll = async (req, res) => {
	try {
		
		const userId = req.query.userId ? new mongoose.Types.ObjectId(jwt.verify(req.query.userId, 'secret123')._id) : null;
		console.log(userId)
		const allPosts = await PostModel.find(req.query.userPost==='true' ? {user: userId} : null ).exec();
		console.log(allPosts)
		return res.json(allPosts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Can not get all posts :('
		}); 
	}
};

export const getOne = async (req, res) => {
	try {
		PostModel.findOneAndUpdate(
			{ _id: req.params.id },
			{ $inc: { viewsCount: 1 } }, 
			{ returnDocument: 'after' })
			.populate('user').exec()
			.then( doc => {
				if (!doc) {
					return res.status(404).json({
						message: 'Cannot find any posts :('
					})
				}

				return res.json(doc);
			})
			.catch(err => {
				console.log(err);
				return res.status(500).json({
					message: 'Can not get one post :\\'
				});
			})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Can not get one post :('
		}); 
	}
};

export const remove = async (req, res) => {
	try {
		console.log(req.params.id);
		PostModel.findOneAndDelete({_id: req.params.id, user: req.userId})
			.then( doc => {
				if (!doc) {
					console.log(err);
					return res.status(500).json({
						message: 'Can not delete post :|'
					});	
				}
				return res.status(200).json({success: true});
			})
			.catch(err => {
				console.log(err);
				return res.status(500).json({
					message: "Can not get access to post :/"
				});
			})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Can not get one post :('
		}); 
	}
};

export const create = async (req, res) => {
	try {
		console.log(req.userId);
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			user: req.userId
		});
		const post = await doc.save(); 
		return res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Can not create post :('
		}); 
	}
};

export const update = async (req, res) => {
	try {
		console.log(req.params.id);
		const userId = jwt.verify(req.body.token, 'secret123')._id;
		await PostModel.updateOne({_id: req.params.id, user: userId}, {
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			user: req.userId
		});
		return res.status(200).json({success: true});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Can not update post :('
		}); 
	}
};
