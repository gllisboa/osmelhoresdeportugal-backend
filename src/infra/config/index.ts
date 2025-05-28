import dotenv from "dotenv";

dotenv.config();

const config = {
    port: parseInt(process.env.PORT || "3001", 10),
    opencage: {
        apiKey: process.env.OPENCAGE_API_KEY,
    },
    // @TODO
    // Adicionar configurações do Firestore futuramente
    // firestore: { ... }
};

// Validação básica de configuração essencial
if (!config.opencage.apiKey) {
    console.error("FATAL ERROR: OPENCAGE_API_KEY is not defined in .env file.");
    process.exit(1); // Termina a aplicação se a chave não estiver definida
}


export default config;