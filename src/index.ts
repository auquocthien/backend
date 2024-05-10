import { AppDataSource } from "./data-source";
const app = require("./app");
const config = require("./config");

async function startServer() {
	try {
		AppDataSource.initialize();
		console.log("connect to database");
		const PORT = config.app.port;
		app.listen(PORT, () => {
			console.log(`server is running on ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
}
startServer();
