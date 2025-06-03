import express from 'express';
import { createMeeting, getMeetings, deleteMeeting } from '../controllers/meeting.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createMeeting);
router.get('/', getMeetings);
router.delete('/:id', deleteMeeting);

export default router;
