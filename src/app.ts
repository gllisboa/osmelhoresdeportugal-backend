// src/app.ts
import express, { Express, Request, Response, NextFunction, RequestHandler } from "express";
//import { GeolocationRoutes } from "./application/geolocation/routes"; // Importaremos depois
//import { ApiError } from "./core/errors/ApiError";

const app: Express = express();

// --- Middlewares Essenciais ---
app.use(express.json()); // Para parsear JSON request bodies

// --- Middleware de CORS (Cross-Origin Resource Sharing) ---
// Essencial para permitir que seu frontend Vue (em localhost:8080, por ex.)
// chame este backend (em localhost:3001)
const corsMiddleware: RequestHandler = (req, res, next) => {
    // Permite acesso de qualquer origem (para dev) - ajuste para produção!
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Métodos HTTP permitidos
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    // Cabeçalhos permitidos
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // Necessário para pré-validação (preflight) em algumas requisições (ex: PUT, DELETE)
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
};
app.use(corsMiddleware);


// --- Rotas da API ---
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// Monta as rotas de geolocalização (serão criadas depois)
//app.use("/api/v1/geolocation", GeolocationRoutes()); // Note a chamada da função

// --- Middleware de Tratamento de Erros (Deve ser o último) ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log do erro no servidor

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            errors: err.errors, // Opcional: para erros de validação
        });
    }

    // Erro genérico do servidor
    return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
});

export default app;