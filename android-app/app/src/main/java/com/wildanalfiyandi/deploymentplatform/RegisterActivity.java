package com.wildanalfiyandi.deploymentplatform;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class RegisterActivity extends Activity {

    private EditText nameInput, emailInput, passwordInput, confirmPasswordInput, verificationCodeInput;
    private Button sendCodeButton, registerButton;
    private View verificationSection;
    private boolean codeSent = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        // Initialize views
        nameInput = findViewById(R.id.register_name_input);
        emailInput = findViewById(R.id.register_email_input);
        passwordInput = findViewById(R.id.register_password_input);
        confirmPasswordInput = findViewById(R.id.register_confirm_password_input);
        verificationCodeInput = findViewById(R.id.verification_code_input);
        sendCodeButton = findViewById(R.id.send_code_button);
        registerButton = findViewById(R.id.register_button);
        verificationSection = findViewById(R.id.verification_section);

        sendCodeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendVerificationCode();
            }
        });

        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleRegister();
            }
        });
    }

    private void sendVerificationCode() {
        String email = emailInput.getText().toString().trim();
        
        if (email.isEmpty()) {
            Toast.makeText(this, "Mohon isi email terlebih dahulu", Toast.LENGTH_SHORT).show();
            return;
        }

        // Mock sending verification code - in production, this would call a backend API
        // TODO: Replace with real email verification service (SendGrid, Mailgun, etc.)
        Toast.makeText(this, "Kode verifikasi telah dikirim ke " + email, Toast.LENGTH_SHORT).show();
        Toast.makeText(this, "Kode demo: " + Constants.MOCK_VERIFICATION_CODE, Toast.LENGTH_LONG).show();
        
        codeSent = true;
        verificationSection.setVisibility(View.VISIBLE);
        sendCodeButton.setEnabled(false);
        sendCodeButton.setText("Kode Terkirim");
    }

    private void handleRegister() {
        String name = nameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        String confirmPassword = confirmPasswordInput.getText().toString().trim();
        String code = verificationCodeInput.getText().toString().trim();

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Mohon isi semua field", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!password.equals(confirmPassword)) {
            Toast.makeText(this, "Password tidak cocok", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!codeSent) {
            Toast.makeText(this, "Mohon kirim kode verifikasi terlebih dahulu", Toast.LENGTH_SHORT).show();
            return;
        }

        // Mock verification - in production, verify with backend
        // TODO: Replace with real backend verification
        if (!code.equals(Constants.MOCK_VERIFICATION_CODE)) {
            Toast.makeText(this, "Kode verifikasi salah", Toast.LENGTH_SHORT).show();
            return;
        }

        // Mock successful registration
        Toast.makeText(this, "Registrasi berhasil! Silakan login", Toast.LENGTH_SHORT).show();
        finish();
    }
}
