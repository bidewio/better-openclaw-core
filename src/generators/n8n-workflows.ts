import type { ResolverOutput } from "../types.js";

/**
 * Generates n8n workflow template files.
 * Returns a map of file paths to JSON content strings.
 */
export function generateN8nWorkflows(resolved: ResolverOutput): Record<string, string> {
	const files: Record<string, string> = {};

	// Only generate if n8n is in the stack
	const hasN8n = resolved.services.some((s) => s.definition.id === "n8n");
	if (!hasN8n) return files;

	files["n8n/workflows/openclaw-webhook-handler.json"] = JSON.stringify(
		createWebhookHandlerWorkflow(resolved),
		null,
		2,
	);

	return files;
}

function createWebhookHandlerWorkflow(resolved: ResolverOutput) {
	// Create a basic n8n workflow JSON that:
	// 1. Has a Webhook trigger node listening on /openclaw-webhook
	// 2. Has a Function node that processes the payload
	// 3. Outputs to a Respond to Webhook node
	const serviceNames = resolved.services.map((s) => s.definition.name).join(", ");

	return {
		name: "OpenClaw Webhook Handler",
		nodes: [
			{
				parameters: {
					httpMethod: "POST",
					path: "openclaw-webhook",
					responseMode: "responseNode",
					options: {},
				},
				id: "webhook-trigger",
				name: "Webhook",
				type: "n8n-nodes-base.webhook",
				typeVersion: 2,
				position: [250, 300],
			},
			{
				parameters: {
					jsCode:
						"// Process OpenClaw webhook payload\n" +
						"const payload = $input.all()[0].json;\n" +
						"\n" +
						"// Available services in this stack:\n" +
						`// ${serviceNames}\n` +
						"\n" +
						"return [{ json: { received: true, timestamp: new Date().toISOString(), payload } }];",
				},
				id: "process-payload",
				name: "Process Payload",
				type: "n8n-nodes-base.code",
				typeVersion: 2,
				position: [470, 300],
			},
			{
				parameters: {
					respondWith: "json",
					responseBody: "={{ JSON.stringify($json) }}",
					options: {},
				},
				id: "respond",
				name: "Respond to Webhook",
				type: "n8n-nodes-base.respondToWebhook",
				typeVersion: 1,
				position: [690, 300],
			},
		],
		connections: {
			Webhook: {
				main: [[{ node: "Process Payload", type: "main", index: 0 }]],
			},
			"Process Payload": {
				main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]],
			},
		},
		active: false,
		settings: { executionOrder: "v1" },
		tags: [{ name: "openclaw" }],
	};
}
