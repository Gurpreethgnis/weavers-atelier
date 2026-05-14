type WhatsAppContext =
  | "general"
  | "custom_shirt"
  | "denim"
  | "weddingwear"
  | "instagram_look"
  | "trousers"
  | "statement_piece"
  | "measurement_help";

const messages: Record<WhatsAppContext, string> = {
  general:
    "Hi Weavers, I'm interested in a custom menswear piece and would like some help.",
  custom_shirt:
    "Hi Weavers, I'm interested in a custom shirt. Can you help me with fabric, fit, and measurements?",
  denim:
    "Hi Weavers, I'm interested in custom denim with embroidery/details. Can you help me design it?",
  weddingwear:
    "Hi Weavers, I'm looking for weddingwear/occasionwear. My event date is ____.",
  instagram_look:
    "Hi Weavers, I saw a look on your Instagram and want to create something similar.",
  trousers:
    "Hi Weavers, I'm interested in custom trousers. Can you help me with fit and fabric options?",
  statement_piece:
    "Hi Weavers, I'm looking to create a unique statement piece. Can you help me design it?",
  measurement_help:
    "Hi Weavers, I need help with my measurements. Can we schedule a video fitting session?",
};

export function getWhatsAppUrl(
  context: WhatsAppContext = "general",
  customMessage?: string
): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || "";
  const message = customMessage || messages[context];
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`;
}

export function getWhatsAppMessage(context: WhatsAppContext): string {
  return messages[context];
}

export { messages as whatsAppMessages };
