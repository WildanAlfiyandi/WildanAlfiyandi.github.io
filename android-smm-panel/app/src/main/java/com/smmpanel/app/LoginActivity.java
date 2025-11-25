package com.smmpanel.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class LoginActivity extends AppCompatActivity {
    
    private EditText etUsername, etPassword;
    private Button btnLogin;
    
    // Default admin credentials
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin2024";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        
        // Check if already logged in
        SharedPreferences prefs = getSharedPreferences("SMM_PREFS", MODE_PRIVATE);
        if (prefs.getBoolean("isLoggedIn", false)) {
            startMainActivity();
            return;
        }
        
        initViews();
        setupListeners();
    }
    
    private void initViews() {
        etUsername = findViewById(R.id.et_username);
        etPassword = findViewById(R.id.et_password);
        btnLogin = findViewById(R.id.btn_login);
    }
    
    private void setupListeners() {
        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                performLogin();
            }
        });
    }
    
    private void performLogin() {
        String username = etUsername.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        
        if (username.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Masukkan username dan password", Toast.LENGTH_SHORT).show();
            return;
        }
        
        if (username.equals(ADMIN_USERNAME) && password.equals(ADMIN_PASSWORD)) {
            // Save login state
            SharedPreferences prefs = getSharedPreferences("SMM_PREFS", MODE_PRIVATE);
            prefs.edit()
                .putBoolean("isLoggedIn", true)
                .putString("username", username)
                .apply();
            
            Toast.makeText(this, "Login berhasil!", Toast.LENGTH_SHORT).show();
            startMainActivity();
        } else {
            Toast.makeText(this, "Username atau password salah!", Toast.LENGTH_SHORT).show();
        }
    }
    
    private void startMainActivity() {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}
