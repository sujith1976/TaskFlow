"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateToken);
router.post('/', task_controller_1.createTask);
router.get('/', task_controller_1.getTasks);
router.get('/:id', task_controller_1.getTask);
router.put('/:id', task_controller_1.updateTask);
router.delete('/:id', task_controller_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map