/**
 * Base resource class
 * All API resources inherit from this class
 */

import { HttpClient } from '../http-client';

export abstract class ResourceBase {
  protected readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }
}
