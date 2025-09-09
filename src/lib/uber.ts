export async function uberFetch(path:string) {
  const res = await fetch(`${process.env.UBER_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.UBER_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    }
    
  });
  if (!res.ok) {
    throw new Error(`Uber API error: ${res.status}`);
  }

  return res.json();
}
