import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsService {
  registerClient(clientData: any) {
    // Logic to register a client
    console.log('Client registered', clientData);
  }

  listClients() {
    // Logic to list clients
    console.log('List of clients');
  }
}
