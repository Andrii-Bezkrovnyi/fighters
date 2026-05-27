import { callApi } from '../helpers/apiHelper';

class FighterService {
  #endpoint = 'fighters.json';

  async getFighters() {
    try {
      const apiResult = await callApi(this.#endpoint);
      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id) {
    try {
      return await callApi(`details/fighter/${id}.json`);
    } catch (error) {
      throw error;
    }
  }
}

export const fighterService = new FighterService();
