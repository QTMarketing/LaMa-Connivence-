/** Only the careers private store may hold applicant CVs. */
export function careersBlobAuth():
  | { oidcToken: string; storeId: string }
  | { token: string }
  | null {
  const oidcToken = process.env.VERCEL_OIDC_TOKEN;
  const storeId = process.env.BLOB_STORE_ID;
  if (oidcToken && storeId) return { oidcToken, storeId };

  const token = process.env.CAREERS_BLOB_READ_WRITE_TOKEN;
  return token ? { token } : null;
}
