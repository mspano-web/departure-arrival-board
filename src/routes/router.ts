/**
 * routers.ts : Express route controllers for all the endpoints of the app
 */

import { Router } from "express";
import * as notificationController from "../controllers/notification-controller"


// ---------------------------------------------------------------

const router : Router = Router();

router
.post("/notification",  notificationController.notification)

export default router;  

  // ---------------------------------------------------------------
