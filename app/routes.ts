import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/auth", "routes/auth.tsx"),
  route("/upload", "routes/upload.tsx"),

  route(
    ".well-known/appspecific/com.chrome.devtools.json",
    "./chrome-devtools.ts",
  ),
] satisfies RouteConfig;
