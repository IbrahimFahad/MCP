import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod";

const server = new McpServer({
  name: "Weather Data Fetcher",
  version: "1.0.0",
});

server.registerTool(
  "getWeatherDataByCityName",
  {
    title: "Get Weather by City",
    description: "Fetches current weather forecast for a given city",
    inputSchema: z.object({
      city: z.string().describe("Name of the city to get weather for")
    }),
    outputSchema: z.object({
      temp: z.string().nullable(),
      forecast: z.string().optional(),
      error: z.string().optional()
    })
  },
  async ({ city }: { city: string }) => {
    const weatherData = await getWeatherByCity(city);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(weatherData)
        }
      ],
      structuredContent: weatherData
    };
  }
);

server.registerResource(
  "weather://cities",
  "weather://cities",
  {
    title: "Supported Cities",
    description: "List of cities that you can query for weather"
  },
  async () => {
    return {
      contents: [
        {
          uri: "weather://cities",
          mimeType: "text/plain",
          text: `Supported Cities:
- London (UK)
- New York (USA)`
        }
      ]
    };
  }
);

async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(" Weather MCP Server Started!");
  console.error(" Tool: getWeatherDataByCityName");
  console.error(" Resource: weather://cities");
  console.error(" Server ready!");
}

async function getWeatherByCity(city: string) {
  if (city.toLowerCase() === "new york") {
    return { temp: "22°C", forecast: "Partly cloudy with a breeze" };
  }
  if (city.toLowerCase() === "london") {
    return { temp: "16°C", forecast: "Rainy and overcast" };
  }
  return { temp: null, error: "Weather data not available for this city" };
}

init().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
