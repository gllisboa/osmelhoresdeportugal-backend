import app from "@/app";
import config from "@/infra/config";

const port = config.port;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    console.log(`[server]: Health check available at http://localhost:${port}/health`);
});