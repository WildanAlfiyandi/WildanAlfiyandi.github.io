package com.wildanalfiyandi.deploymentplatform;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class LoginActivity extends Activity {

    private EditText emailInput, passwordInput;
    private Button loginButton, googleButton, facebookButton, guestButton;
    private TextView registerLink, forgotPasswordLink;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // Initialize views
        emailInput = findViewById(R.id.email_input);
        passwordInput = findViewById(R.id.password_input);
        loginButton = findViewById(R.id.login_button);
        googleButton = findViewById(R.id.google_login_button);
        facebookButton = findViewById(R.id.facebook_login_button);
        guestButton = findViewById(R.id.guest_login_button);
        registerLink = findViewById(R.id.register_link);
        forgotPasswordLink = findViewById(R.id.forgot_password_link);

        // Set click listeners
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleEmailLogin();
            }
        });

        googleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleGoogleLogin();
            }
        });

        facebookButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleFacebookLogin();
            }
        });

        guestButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleGuestLogin();
            }
        });

        registerLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
                startActivity(intent);
                overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
            }
        });

        forgotPasswordLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(LoginActivity.this, "Fitur reset password akan segera hadir", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void handleEmailLogin() {
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Mohon isi email dan password", Toast.LENGTH_SHORT).show();
            return;
        }

        // Mock authentication - in production, this would call a backend API
        if (email.equals("admin@example.com") && password.equals("admin123")) {
            navigateToDashboard("admin");
        } else {
            navigateToDashboard("user");
        }
    }

    private void handleGoogleLogin() {
        // Mock Google login - in production, this would use Firebase Auth or Google Sign-In
        Toast.makeText(this, "Google login (memerlukan konfigurasi OAuth)", Toast.LENGTH_SHORT).show();
        // For demo purposes, proceed to dashboard
        new android.os.Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                navigateToDashboard("user");
            }
        }, 1000);
    }

    private void handleFacebookLogin() {
        // Mock Facebook login - in production, this would use Facebook SDK
        Toast.makeText(this, "Facebook login (memerlukan konfigurasi Facebook SDK)", Toast.LENGTH_SHORT).show();
        // For demo purposes, proceed to dashboard
        new android.os.Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                navigateToDashboard("user");
            }
        }, 1000);
    }

    private void handleGuestLogin() {
        navigateToDashboard("guest");
    }

    private void navigateToDashboard(String userType) {
        Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
        intent.putExtra("user_type", userType);
        startActivity(intent);
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
        finish();
    }
}
