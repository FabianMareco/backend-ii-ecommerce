import { ticketRepository } from '../repositories/ticket.repository.js';

class TicketService {
  async createTicket(ticketData) {
    return await ticketRepository.createTicket(ticketData);
  }

  async getTicketById(id) {
    return await ticketRepository.getTicketById(id);
  }

  async getAllTickets() {
    return await ticketRepository.getAllTickets();
  }

  async getTicketsByPurchaser(email) {
    return await ticketRepository.getTicketsByPurchaser(email);
  }
}

export default new TicketService();
