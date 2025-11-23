package com.wildanalfiyandi.deploymentplatform;

/**
 * Constants for mock implementation.
 * 
 * IMPORTANT: These are MOCK values for UI prototype demonstration only.
 * In production, these should be replaced with secure backend API calls.
 */
public class Constants {
    
    // MOCK CREDENTIALS - FOR DEMO ONLY
    // TODO: Replace with real authentication API
    public static final String MOCK_ADMIN_EMAIL = "admin@example.com";
    public static final String MOCK_ADMIN_PASSWORD = "admin123";
    
    // MOCK VERIFICATION CODE - FOR DEMO ONLY
    // TODO: Replace with real email verification service
    public static final String MOCK_VERIFICATION_CODE = "123456";
    
    // UI Constants
    public static final int SPLASH_DURATION_MS = 3000; // 3 seconds
    
    // Mock User Types
    public static final String USER_TYPE_ADMIN = "admin";
    public static final String USER_TYPE_USER = "user";
    public static final String USER_TYPE_GUEST = "guest";
    
    // Mock Balance
    public static final String MOCK_BALANCE = "Rp 1.500.000";
    
    // Private constructor to prevent instantiation
    private Constants() {
        throw new AssertionError("Cannot instantiate constants class");
    }
}
