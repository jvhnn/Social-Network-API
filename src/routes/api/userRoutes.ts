import { Router } from 'express';
const router = Router();
import {getAllUsers, getUserById, createUser, updateUser, deleteUser, createFriend, deleteFriend} from '../../controllers/userController.js';

// /api/users
router.route('/')
    .get(getAllUsers)
    .post(createUser);

// /api/users/:userId
router.route('/:userId')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// /api/users/:userId/friends/:friendId    
router.route('/:userId/friends/:friendId')
    .post(createFriend)
    .delete(deleteFriend);

export { router as userRouter };