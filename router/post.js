import { postCreateValidation } from '../validations.js';
import isAuth from '../util/isAuth.js';
import handleValidationErrors from '../util/handleValidationErrors.js';

import * as postController from '../controllers/postController.js'

import express from 'express';

const router = express.Router();

router.get('', postController.getAll);

router.get('/tags', postController.getLastTags);

router.get('/:id', postController.getOne);

router.post('', isAuth, postCreateValidation, handleValidationErrors, postController.create);

router.patch('/:id', isAuth, postCreateValidation, handleValidationErrors, postController.update);

router.delete('/:id', isAuth, postController.remove);


export default router;