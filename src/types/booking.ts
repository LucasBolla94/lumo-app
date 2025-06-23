// types/booking.ts

export type BookingFormData = {
  // 🔑 ID real do documento Firestore (doc.id), usado para updates
  id: string;

  // 📄 Informações básicas do cliente
  reference: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;

  // 🧹 Detalhes do serviço agendado
  service: string;
  date: string;  // formato "YYYY-MM-DD"
  time: string;  // formato "HH:mm"
  hours: number; // total de horas contratadas
  estimate: number; // valor estimado em £

  // 📞 Preferência de contato: ex ["Email", "WhatsApp"]
  preferredContact: string[];

  // 🏠 Endereço do cliente
  address: string;
  number: string;
  postcode: string;

  // 🛠️ Campos administrativos opcionais
  notes?: string;             // anotação interna
  confirmed?: boolean | null; // confirmação (sim/não/nulo)
  cancel?: boolean;           // cancelado
};
