import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { format } from "date-fns";

// Gera referência no formato LDDMMYY1234 (sem repetições)
export const generateReference = async (): Promise<string> => {
  const bookingsSnapshot = await getDocs(collection(db, "bookings"));
  let ref: string;
  let exists = true;

  do {
    const todayStr = format(new Date(), "ddMMyy");
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    ref = `L${todayStr}${randomDigits}`;
    exists = bookingsSnapshot.docs.some((doc) => doc.data().reference === ref);
  } while (exists);

  return ref;
};
