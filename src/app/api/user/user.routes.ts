import express from 'express';
import { createUser, login } from './user.controller';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', login);

export const UserRouter = router;
