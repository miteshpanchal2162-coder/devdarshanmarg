import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import templeRoutes from "../modules/temples/temple.routes";
import {
  deityRoutes,
  categoryRoutes,
  countryRoutes,
  stateRoutes,
  cityRoutes,
  festivalRoutes,
} from "../modules/reference/reference.routes";
import mediaRoutes from "../modules/media/media.routes";
import userRoutes from "../modules/users/user.routes";
import activityRoutes from "../modules/activity/activity.routes";
import contentRoutes from "../modules/content/content.routes";
import seoRoutes from "../modules/seo/seo.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/temples", templeRoutes);
router.use("/deities", deityRoutes);
router.use("/categories", categoryRoutes);
router.use("/countries", countryRoutes);
router.use("/states", stateRoutes);
router.use("/cities", cityRoutes);
router.use("/festivals", festivalRoutes);
router.use("/media", mediaRoutes);
router.use("/users", userRoutes);
router.use("/activity-logs", activityRoutes);
router.use("/content", contentRoutes);
router.use("/seo", seoRoutes);

export default router;
