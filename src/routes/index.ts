import { Application } from 'express';

import newsletterRouter from './newsletter';
import projectRouter from './project';
import feedRouter from "./feed";
import userRouter from "./user";
import backgroundRouter from "./background";
import partnerRouter from "./partner";

/**
 * Sets up routes for the Express application.
 * @function
 * @param {Application} app
 * @returns {void}
 */
const setupRoutes = (app: Application): void => {
    app.use('/user', userRouter);
    app.use('/feed', feedRouter);
    app.use('/background', backgroundRouter);
    app.use('/partner', partnerRouter);
    app.use('/newsletter', newsletterRouter);
    app.use('/project', projectRouter);
};

export { setupRoutes };