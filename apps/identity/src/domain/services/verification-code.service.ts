export class VerificationCodeService {
  public generate() {
    const code = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    return { code, expiresAt };
  }
}
