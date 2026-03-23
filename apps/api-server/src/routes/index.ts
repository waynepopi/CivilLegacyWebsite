import { Router, type IRouter } from "express";
import healthRouter from "./health";
import paynowRouter from "./paynow";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/paynow", paynowRouter);

export default router;
