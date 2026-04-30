import config from '../../config/config.js';
import UserDaoMongo from './mongo/user.dao.js';
import ProductDaoMongo from './mongo/product.dao.js';
import CartDaoMongo from './mongo/cart.dao.js';
import TicketDaoMongo from './mongo/ticket.dao.js';

const persistence = config.persistence || 'mongo';

let userDao, productDao, cartDao, ticketDao;

switch (persistence) {
  case 'mongo':
    userDao = new UserDaoMongo();
    productDao = new ProductDaoMongo();
    cartDao = new CartDaoMongo();
    ticketDao = new TicketDaoMongo();
    console.log('✅ Persistencia: MongoDB');
    break;
  default:
    userDao = new UserDaoMongo();
    productDao = new ProductDaoMongo();
    cartDao = new CartDaoMongo();
    ticketDao = new TicketDaoMongo();
    console.log('✅ Persistencia: MongoDB (default)');
}

export { userDao, productDao, cartDao, ticketDao };
