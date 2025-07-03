import LocalStorageManager from "../../core/LocalStorageManager.ts";
import { jwt } from "../../core/utils/text_display.ts";
import { decodeJwt, jwtVerify, type JWTPayload, type JWTHeaderParameters } from "jose";

// Enhanced type definitions for better type safety
interface TokenValidationResult {
    isValid: boolean;
    payload?: JWTPayload;
    header?: JWTHeaderParameters;
    error?: string;
}

interface DecodedTokenResult {
    success: boolean;
    payload?: JWTPayload & {id?: number, lastName?: string, firstName?: string};
    error?: string;
}

/**
 * Advanced JWT Token Manager
 *
 * This class provides a comprehensive interface for JWT token management,
 * including validation, decoding, and storage operations. It implements
 * the singleton pattern to ensure a consistent token state across the application.
 */
class JWTTokenManager {
    // Private static instance for a singleton pattern
    private static instance: JWTTokenManager | null = null;

    // Private properties to encapsulate internal state
    private readonly secret: Uint8Array;
    private cachedToken: string | null = null;
    private lastValidationTime: number = 0;
    private readonly validationCacheTimeout = 5 * 60 * 1000; // 5-minute cache

    /**
     * Private constructor enforces singleton pattern
     * Initializes the secret key from environment variables
     */
    private constructor() {
        const secretKey = import.meta.env.VITE_JWT_TOKEN_SECRET;

        if (!secretKey) {
            throw new Error("JWT secret key is not configured. Please set VITE_JWT_TOKEN_SECRET in your environment.");
        }

        // Convert secret to Uint8Array for cryptographic operations
        this.secret = new TextEncoder().encode(secretKey);
    }

    /**
     * Singleton instance getter
     * Ensures only one instance of the token manager exists
     */
    public static getInstance(): JWTTokenManager {
        if (!JWTTokenManager.instance) {
            JWTTokenManager.instance = new JWTTokenManager();
        }
        return JWTTokenManager.instance;
    }

    /**
     * Retrieves the current token from storage with caching
     * Uses lazy loading to minimize storage access
     */
    private getCurrentToken(): string | null {
        if (!this.cachedToken) {
            this.cachedToken = LocalStorageManager.get<string>(jwt.tokenKey);
        }
        return this.cachedToken;
    }

    public getRefreshToken(): string | null {
        return LocalStorageManager.get<string>(jwt.refreshTokenKey);
    }

    /**
     * Updates the cached token when storage changes
     * Call this method when the token is updated externally
     */
    public refreshTokenCache(): void {
        this.cachedToken = LocalStorageManager.get<string>(jwt.tokenKey);
        this.lastValidationTime = 0; // Reset validation cache
    }

    /**
     * Comprehensive token verification with enhanced error handling
     *
     * This method performs cryptographic verification of the JWT token
     * and implements caching to avoid redundant verification operations.
     */
    public async verifyToken(): Promise<TokenValidationResult> {
        const token = this.getCurrentToken();

        // Early return if no token exists
        if (!token) {
            return {
                isValid: false,
                error: "No token found in storage"
            };
        }

        // Check if we have a recent validation result cached
        const now = Date.now();
        if (now - this.lastValidationTime < this.validationCacheTimeout) {
            //TODO Note: In a production app, you might want to cache the actual result
            // For this example, we'll re-verify to ensure accuracy
        }

        try {
            // Perform cryptographic verification using the JOSE library
            const verificationResult = await jwtVerify(token, this.secret);

            // Update validation timestamp
            this.lastValidationTime = now;

            return {
                isValid: true,
                payload: verificationResult.payload,
                header: verificationResult.protectedHeader
            };

        } catch (error) {
            // Comprehensive error handling for different JWT failure modes
            let errorMessage = "Token verification failed";

            if (error instanceof Error) {
                // Parse specific JWT errors for better user experience
                if (error.message.includes("expired")) {
                    errorMessage = "Token has expired";
                } else if (error.message.includes("signature")) {
                    errorMessage = "Invalid token signature";
                } else if (error.message.includes("malformed")) {
                    errorMessage = "Malformed token structure";
                } else {
                    errorMessage = `Verification error: ${error.message}`;
                }
            }

            return {
                isValid: false,
                error: errorMessage
            };
        }
    }

    /**
     * Safe token decoding without verification
     *
     * This method extracts the payload from a JWT without verifying its signature.
     * Use this when you need to read token data but signature verification isn't required.
     */
    public decodeToken(): DecodedTokenResult {
        const token = this.getCurrentToken();

        if (!token) {
            return {
                success: false,
                error: "No token available for decoding"
            };
        }

        try {
            // Decode without verification - useful for reading expired tokens
            const payload = decodeJwt(token);

            return {
                success: true,
                payload
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to decode token"
            };
        }
    }

    /**
     * Convenience method to check if token exists and is valid
     * Returns a simple boolean for quick validity checks
     */
    public async isValidToken(): Promise<boolean> {
        const result = await this.verifyToken();
        return result.isValid;
    }

    /**
     * Extract specific claims from the token payload
     * Provides type-safe access to common JWT claims
     */
    public getTokenClaim<T = never>(claimName: string): T | null {
        const decodeResult = this.decodeToken();

        if (!decodeResult.success || !decodeResult.payload) {
            return null;
        }

        return (decodeResult.payload as never)[claimName] ?? null;
    }

    /**
     * Check if the token is expired based on 'exp' claim
     * Useful for proactive token refresh logic
     */
    public isTokenExpired(): boolean {
        const exp = this.getTokenClaim<number>('exp');

        if (!exp) {
            return true; // Consider tokens without expiration as expired for safety
        }

        // JWT exp claim is in seconds, Date.now() is in milliseconds
        return Date.now() >= exp * 1000;
    }

    /**
     * Get time remaining until token expiration
     * Returns milliseconds until expiration, or 0 if expired/invalid
     */
    public getTimeUntilExpiration(): number {
        const exp = this.getTokenClaim<number>('exp');

        if (!exp) {
            return 0;
        }

        const expirationTime = exp * 1000; // Convert to milliseconds
        const timeRemaining = expirationTime - Date.now();

        return Math.max(0, timeRemaining);
    }

    /**
     * Clear cached token data
     * Call this when logging out or when the token is manually updated
     */
    public clearCache(): void {
        this.cachedToken = null;
        this.lastValidationTime = 0;
    }
}

// Export singleton instance for convenient access
export const jwtTokenManager = JWTTokenManager.getInstance();

// Also export the class for cases where direct instantiation control is needed
export default JWTTokenManager;