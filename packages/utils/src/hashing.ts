/* ---------- Internal ---------- */
import { randomBytes, pbkdf2Sync, timingSafeEqual } from "crypto";

/**
 * @description
 * Hashing class for password hashing and verification.
 * Uses PBKDF2 with SHA-512 and a random salt.
 */
export class Hashing {
  static saltLength = 16;
  private static iterations = 100000;
  private static keyLength = 64;
  private static digest = "sha512";

  /**
   * @description
   * Generates a hashed password using PBKDF2 with SHA-512.
   *
   * @param password Password to hash
   * @throws Error if password is empty
   * @returns {string} Hashed password
   */
  static generate(password: string): string {
    if (!password) {
      throw new Error("Password cannot be empty");
    }

    const salt = randomBytes(this.saltLength);
    const hash = pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest);

    return `${salt.toString("hex")}:${hash.toString("hex")}`;
  }

  /**
   * @description
   * Compares a hashed password with a plain password using a timing-safe comparison.
   *
   * @param hash Hashed password
   * @param password Plain password to compare
   * @returns {boolean} True if the passwords match, false otherwise
   */
  static compare(hash: string, password: string): boolean {
    if (!hash || !password) {
      return false;
    }

    const [saltHex, hashHex] = hash.split(":");
    if (!saltHex || !hashHex) {
      return false;
    }

    const salt = Buffer.from(saltHex, "hex");
    const stored = Buffer.from(hashHex, "hex");

    const hashed = pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest);

    return timingSafeEqual(stored, hashed);
  }
}
