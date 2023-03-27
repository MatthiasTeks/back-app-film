import { Application } from 'express';
import homeRouter from './home';
import authRouter from './auth';
import newsletterRouter from './newsletter';
import projetRouter from './projet';

/**
 * Sets up routes for the Express application.
 * @function
 * @param {Application} app - The Express application.
 * @returns {void}
 */
const setupRoutes = (app: Application): void => {
    app.use('/home', homeRouter);
    app.use('/auth', authRouter);
    app.use('/newsletter', newsletterRouter);
    app.use('/projet', projetRouter);
};

export { setupRoutes };