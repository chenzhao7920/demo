export const cors_options = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Credentials": "true",
	credentials: true,
    origin: [
        "http://localhost:3000",
		"https://localhost:3000",
		"http://localhost:3001",
		"https://localhost:3001",
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}