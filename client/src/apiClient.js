import axios from "axios";
// const url = "http://localhost:5000/";
const url = "/";

export class ApiClient {
  async getTemplate() {
    return await axios.get(`${url}template/`);
  }
  async getSchedule() {
    return await axios.get(`${url}schedule/`);
  }
  async submitDay(active) {
    return await axios.post(`${url}updateDay/`, active);
  }

  async updateDay(active) {
    await this.submitDay(active);
  }

  async submitExercise(activeEx, text, active) {
    let patient = {
      ...active,
      exercises: [...active.exercises].map((v) => {
        if (v.name === activeEx.name) {
          return {
            ...v,
            weight: `${text.kg && text.lb ? `${text.kg}/${text.lb}` : ""}`,
            notes: `${text.notes}`,
          };
        }
        return v;
      }),
    };
    this.submitDay(patient);
    return patient;
  }
}
