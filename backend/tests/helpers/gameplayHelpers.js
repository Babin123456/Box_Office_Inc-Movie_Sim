export const TEST_PASSWORD = ["test", "Pw", "8842"].join("-");

export const registerStudio = async (
  baseUrl,
  id = Math.random().toString(36).substring(7),
) => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: `player_${id}`,
      email: `p1_${id}@example.com`,
      password: TEST_PASSWORD,
      studioName: `P1 Studios_${id}`,
    }),
  });

  return res.json(); // { success, token, user, studio }
};

export const authGet = (baseUrl, path, token) =>
  fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const authPost = (baseUrl, path, token) =>
  fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });