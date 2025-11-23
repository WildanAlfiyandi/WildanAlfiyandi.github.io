package com.wildanalfiyandi.deploymentplatform;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class DashboardActivity extends Activity {

    private TextView welcomeText, balanceText;
    private Button adminPanelButton, accountButton, paymentButton;
    private String userType;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        userType = getIntent().getStringExtra("user_type");
        if (userType == null) userType = "guest";

        // Initialize views
        welcomeText = findViewById(R.id.welcome_text);
        balanceText = findViewById(R.id.balance_text);
        adminPanelButton = findViewById(R.id.admin_panel_button);
        accountButton = findViewById(R.id.account_button);
        paymentButton = findViewById(R.id.payment_button);

        // Set welcome message
        String welcomeMessage = "Selamat Datang!";
        if (userType.equals("admin")) {
            welcomeMessage = "Selamat Datang, Admin!";
            adminPanelButton.setVisibility(View.VISIBLE);
        } else if (userType.equals("guest")) {
            welcomeMessage = "Selamat Datang, Guest!";
        }
        welcomeText.setText(welcomeMessage);

        // Mock balance
        balanceText.setText("Rp 1.500.000");

        // Set click listeners
        adminPanelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(DashboardActivity.this, AdminPanelActivity.class);
                startActivity(intent);
                overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
            }
        });

        accountButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(DashboardActivity.this, "Fitur akun", Toast.LENGTH_SHORT).show();
            }
        });

        paymentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(DashboardActivity.this, PaymentActivity.class);
                startActivity(intent);
                overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
            }
        });

        // Setup product grid (mock data)
        setupProducts();
    }

    private void setupProducts() {
        // This would load products from a backend in production
        // For now, it's a placeholder
    }
}
