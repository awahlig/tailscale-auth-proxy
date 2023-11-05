const querystring = require("querystring");

const TAILSCALE_SOCK = "/var/run/tailscale/tailscaled.sock";
const TAILSCALE_HOST = "local-tailscaled.sock";

const USERS = JSON.parse(process.env["USERS"]);

async function auth(r) {
  try {
    const userpass = await getUserPass(r.remoteAddress);
    const auth = Buffer.from(userpass).toString("base64");
    r.headersOut["Authorization"] = `Basic ${auth}`;
    r.return(200);
  } catch (e) {
    r.error(e);
    r.return(401);
  }
}

async function getUserPass(addr) {
  const info = await whois(addr);
  const user = info.UserProfile.LoginName;
  const userpass = USERS[user] ?? USERS["default"];
  if (!userpass) {
    throw `unknown user: ${user}`;
  }
  return userpass;
}

async function whois(addr) {
  const addrq = querystring.escape(addr);
  const url = `http://unix://${TAILSCALE_SOCK}:/localapi/v0/whois?addr=${addrq}`;
  const resp = await ngx.fetch(url, {
    headers: {
      "Host": TAILSCALE_HOST,
    }
  });
  if (resp.status !== 200) {
    const text = await resp.text();
    throw `whois failed: ${text}`;
  }
  return await resp.json();
}

export default {
  auth,
};
