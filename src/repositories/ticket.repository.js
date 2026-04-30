import { ticketDao } from '../dao/factory.js';

class TicketRepository {
  async createTicket(ticketData) {
    const code = `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const ticket = {
      code,
      purchase_datetime: new Date(),
      amount: ticketData.amount,
      purchaser: ticketData.purchaser
    };
    return await ticketDao.create(ticket);
  }

  async getTicketById(id) {
    return await ticketDao.findById(id);
  }

  async getAllTickets() {
    return await ticketDao.findAll();
  }

  async getTicketsByPurchaser(email) {
    return await ticketDao.findByPurchaser(email);
  }
}

export const ticketRepository = new TicketRepository();
