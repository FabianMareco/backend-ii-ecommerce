import Ticket from '../../models/Ticket.js';

class TicketDaoMongo {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async findById(id) {
    return await Ticket.findById(id);
  }

  async findAll() {
    return await Ticket.find();
  }

  async findByPurchaser(email) {
    return await Ticket.find({ purchaser: email });
  }
}

export default TicketDaoMongo;
