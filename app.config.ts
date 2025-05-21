// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "unenv";

export default defineConfig({
	tsr: {
		appDirectory: "src",
	},
	vite: {
		plugins: [tailwindcss()],
	},
	server: {
		preset: "cloudflare-pages",
		unenv: cloudflare,
		prerender: {
			routes: ["/"],
			crawlLinks: true,
		},
	},
});
