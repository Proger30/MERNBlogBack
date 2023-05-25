import {getAuthMe, postAuthLogin, postAuthRegister} from '../controllers/userController.js';
import { registerValidation, loginValidation } from '../validations.js';
import isAuth from '../util/isAuth.js';
import handleValidationErrors from '../util/handleValidationErrors.js';

import express from 'express';

const router = express.Router();

router.get('/me', isAuth, getAuthMe);

router.post('/login', loginValidation, handleValidationErrors, postAuthLogin);

router.post('/register', registerValidation, handleValidationErrors, postAuthRegister);

export default router;