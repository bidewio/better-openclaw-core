import type { ServiceDefinition } from "../../types.js";

export const headscaleDefinition: ServiceDefinition = {
    id: "headscale",
    name: "Headscale",
    description: "An open source, self-hosted implementation of the Tailscale control server.",
    category: "dev-tools",
    icon: "🌐",
    image: "headscale/headscale",
    imageTag: "latest",
    command: "headscale serve",
    ports: [
        {
            host: 8080,
            container: 8080,
            description: "Headscale API and Web UI",
            exposed: true,
        },
        {
            host: 9090,
            container: 9090,
            description: "Headscale metrics",
            exposed: false,
        },
    ],
    volumes: [
        {
            name: "headscale-data",
            containerPath: "/var/lib/headscale",
            description: "Headscale database and configurations",
        },
        {
            name: "headscale-config",
            containerPath: "/etc/headscale",
            description: "Headscale configuration files",
        },
    ],
    environment: [
        {
            key: "HEADSCALE_SERVER_URL",
            defaultValue: "http://localhost:8080",
            secret: false,
            description: "The URL where the headscale server will be accessible",
            required: true,
        },
        {
            key: "HEADSCALE_METRICS_LISTEN_ADDR",
            defaultValue: "0.0.0.0:9090",
            secret: false,
            description: "Metrics listen address",
            required: false,
        },
    ],
    healthcheck: {
        test: "curl -f http://localhost:8080/health",
        interval: "30s",
        timeout: "5s",
        retries: 3,
    },
    docsUrl: "https://github.com/juanfont/headscale",
    tags: ["vpn", "networking", "tailscale", "mesh-network"],
    dependsOn: [],
    restartPolicy: "unless-stopped",
    networks: [],
    skills: [],
    openclawEnvVars: [],
    maturity: "stable",
    requires: [],
    recommends: [],
    conflictsWith: [],
    gpuRequired: false
};
