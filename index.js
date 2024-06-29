import express from "express";
import http from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { createBareServer } from "@tomphttp/bare-server-node";
import createRammerhead from "rammerhead/src/server/index.js";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import { existsSync } from "fs";
import chalk from "chalk";
import { hostname } from "node:os";
import cors from "cors";
import path from "node:path";
import wisp from "wisp-server-node";
import { spawn } from "child_process";

if (!existsSync("./dist")) {
    console.log(chalk.yellow("Building the project..."));
    const buildProcess = spawn("npm", ["run", "build"], { stdio: "inherit" });

    buildProcess.on("close", (code) => {
        if (code !== 0) {
            console.error(chalk.red("Build failed with code:"), code);
            process.exit(1);
        } else {
            console.log(chalk.green("Build completed successfully."));
            startServer();
        }
    });

    buildProcess.on("error", (err) => {
        console.error(chalk.red("Failed to start build process:"), err);
        process.exit(1);
    });
} else {
    startServer();
}

function startServer() {
    var theme = chalk.hex("#00FF7F");
    var rammerhead = chalk.rgb(134, 234, 255);
    var baretext = chalk.rgb(195, 0, 0);
    var uv = chalk.rgb(255, 0, 255);
    var bundles = chalk.rgb(255, 150, 0);
    var host = chalk.hex("0d52bd");

    const server = http.createServer();
    console.log(chalk.green("Creating HTTP Server..."));
    const app = express();
    const __dirname = process.cwd();
    const bare = createBareServer("/bare/");
    console.log(baretext("Starting Bare Server..."));
    const PORT = process.env.PORT || 8080;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname + "/dist"));
    console.log(chalk.blue("Serving Astro Files..."));
    app.use("/@/", express.static(uvPath));
    console.log(uv("Serving Ultraviolet Bundles..."));
    app.use("/epoxy/", express.static(epoxyPath));
    app.use("/libcurl/", express.static(libcurlPath));
    app.use("/baremux/", express.static(baremuxPath));
    console.log(bundles("Serving Epoxy, Libcurl, and Bare-Mux Bundles..."));
    app.use(cors());

    console.log(rammerhead("Starting Rammerhead..."));
    const rh = createRammerhead();
    const rammerheadScopes = [
        "/rammerhead.js",
        "/hammerhead.js",
        "/transport-worker.js",
        "/task.js",
        "/iframe-task.js",
        "/worker-hammerhead.js",
        "/messaging",
        "/sessionexists",
        "/deletesession",
        "/newsession",
        "/editsession",
        "/needpassword",
        "/syncLocalStorage",
        "/api/shuffleDict",
    ];
    const rammerheadSession = /^\/[a-z0-9]{32}/;

    function shouldRouteRh(req) {
        const url = new URL(req.url, "http://0.0.0.0");
        return (
            rammerheadScopes.includes(url.pathname) ||
            rammerheadSession.test(url.pathname)
        );
    }

    function routeRhRequest(req, res) {
        rh.emit("request", req, res);
    }

    function routeRhUpgrade(req, socket, head) {
        rh.emit("upgrade", req, socket, head);
    }

    console.log(chalk.blue("Creating Paths..."));
    app.get("/", (req, res) => {
        res.sendFile(path.join(process.cwd(), "/dist/index.html"));
      });

      app.get("/go", (req, res) => {
        res.sendFile(path.join(process.cwd(), "/dist/go/index.html"));
      });

    app.get("/error", (req, res) => {
        res.sendFile(path.join(process.cwd(), "/dist/error.html"));
      });

    console.log(chalk.green("Creating HTTP Server Requests..."));
    server.on("request", (req, res) => {
        if (bare.shouldRoute(req)) {
            bare.routeRequest(req, res);
        } else if (shouldRouteRh(req)) {
            routeRhRequest(req, res);
        } else {
            app(req, res);
        }
    });

    server.on("upgrade", (req, socket, head) => {
        if (bare.shouldRoute(req)) {
            bare.routeUpgrade(req, socket, head);
        } else if (shouldRouteRh(req)) {
            routeRhUpgrade(req, socket, head);
        } else if (req.url.endsWith("/wisp/")) {
            wisp.routeRequest(req, socket, head);
        } else {
            socket.end();
        }
    });

    server.on("listening", () => {
        const address = server.address();
        console.log(`Listening to ${chalk.bold(theme("Proxathon Horizon"))} on:`);

        console.log(`  ${chalk.bold(host("Local System:"))}            http://${address.family === "IPv6" ? `[${address.address}]` : address.address}${address.port === 80 ? "" : ":" + chalk.bold(address.port)}`);

        console.log(`  ${chalk.bold(host("Local System:"))}            http://localhost${address.port === 8080 ? "" : ":" + chalk.bold(address.port)}`);

        try {
            console.log(`  ${chalk.bold(host("On Your Network:"))}  http://${address.address}${address.port === 8080 ? "" : ":" + chalk.bold(address.port)}`);
        } catch (err) {
            // can't find LAN interface
        }

        if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
            console.log(`  ${chalk.bold(host("Replit:"))}           https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
        }

        if (process.env.HOSTNAME && process.env.GITPOD_WORKSPACE_CLUSTER_HOST) {
            console.log(`  ${chalk.bold(host("Gitpod:"))}           https://${PORT}-${process.env.HOSTNAME}.${process.env.GITPOD_WORKSPACE_CLUSTER_HOST}`);
        }

        if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
            console.log(`  ${chalk.bold(host("Github Codespaces:"))}           https://${process.env.CODESPACE_NAME}-${address.port === 80 ? "" : address.port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`);
        }
    });
    server.listen({ port: PORT });
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    function shutdown() {
        console.log(chalk.redBright("Shutting Down Horizon..."));
        server.close();
        bare.close();
        process.exit(0);
    }
}
