"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const meeting_controller_1 = require("../controllers/meeting.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateToken);
router.post('/', meeting_controller_1.createMeeting);
router.get('/', meeting_controller_1.getMeetings);
router.delete('/:id', meeting_controller_1.deleteMeeting);
exports.default = router;
//# sourceMappingURL=meeting.routes.js.map