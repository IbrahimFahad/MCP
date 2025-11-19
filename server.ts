import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z} from "zod";



const server = new McpServer({
  name: 'Weather Data Fetcher',
  version: '1.0.0'
});

server.registerTool(
  'Weather',
  {
    title: 'getWeatherDataByCityName',
    description: 'Get weather data for New York or London',
    inputSchema: { city:z.string().describe("Name of the city to get weather for ")},
  },
  async (args: { city: string }) => {
  const { city } = args;
  const output = await getWeatherByCity(city);
  return {
    content: [{ type: 'text', text: JSON.stringify(output) }],
  };
}
);






async function getWeatherByCity (city: string){
   if (city.toLowerCase() === 'new york') {
    return { temp: '22°C', forecast: 'Partly cloudy with a breeze' };
}
 if (city.toLowerCase() === 'london') {
    return { temp: '16°C', forecast: 'Rainy and overcast' };
  }
  return { temp: null, error: 'Weather data not available for this city' };
}