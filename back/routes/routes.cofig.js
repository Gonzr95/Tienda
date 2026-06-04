import { router as brandsRouter } from './brands.js';
import { router as productsRouter } from './products.js';
import { router as usersRouter } from './users.js';
import { router as backofficeRouter } from './backoffice.js';
import { router as administratorRouter } from './administrator.js';
import { router as ticketsRouter } from './tickets.js';

export function setupRoutes(app) {
    app.use('/api', brandsRouter);
    app.use('/api', productsRouter);
    app.use('/api', usersRouter);
    app.use('/api', backofficeRouter);
    app.use('/api', administratorRouter);
    app.use('/api', ticketsRouter);
}
