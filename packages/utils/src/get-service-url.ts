/* ---------- Constants ---------- */
const production = process.env.NODE_ENV === "production";

const services = {
  users: "http://users:4001/graphql",
  posts: "http://posts:4002/graphql",
  comments: "http://comments:4003/graphql",
  categories: "http://categories:4004/graphql",
};

/* ---------- Types ---------- */
type Service = keyof typeof services;

/**
 * @description
 * This function returns the service url for the given service name.
 * If the service is not found, it throws an error.
 *
 * In development it uses localhost instead of the service name (for docker compose).
 *
 * @param {Service} service - The name of the service.
 * @throws {Error} - If the service url is not found.
 * @returns {string} - The service url.
 */
export function getServiceUrl(service: Service): string {
  const url = services[service];
  if (!url) throw new Error(`${service} service url not found`);

  if (production) return url;

  return url.replace(`${service}:`, "localhost:");
}
