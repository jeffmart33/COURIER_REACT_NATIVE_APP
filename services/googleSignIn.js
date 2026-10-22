import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const HOOKS_AUTH_URL = (process.env.EXPO_PUBLIC_HOOKS_AUTH_URL || "https://supabase.hooksfoodapp.com").replace(/\/+$/, "");

export const googleAccessToken = async () => {
  const redirectTo = Linking.createURL("google-auth");

  const url = `${HOOKS_AUTH_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;

  const result = await WebBrowser.openAuthSessionAsync(url, redirectTo);

  if (result.type !== "success" || !result.url) {
    return null;
  }

  const query = result.url.includes("#") ? result.url.split("#")[1] : result.url.split("?")[1] || "";

  const params = new URLSearchParams(query);

  if (params.get("error")) {
    throw new Error(params.get("error_description") || "Google sign in failed");
  }

  return params.get("access_token");
};
