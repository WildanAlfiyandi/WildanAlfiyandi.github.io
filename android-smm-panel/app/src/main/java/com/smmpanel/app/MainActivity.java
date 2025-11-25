package com.smmpanel.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

public class MainActivity extends AppCompatActivity {
    
    private TextView tvWelcome, tvTotalOrders, tvTotalUsers, tvTotalRevenue, tvTotalServices;
    private CardView cardOrders, cardUsers, cardServices, cardAnalytics;
    private LinearLayout btnLogout;
    
    // Sample data
    private int totalOrders = 1247;
    private int totalUsers = 8432;
    private double totalRevenue = 24589.50;
    private int totalServices = 156;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        initViews();
        setupData();
        setupListeners();
    }
    
    private void initViews() {
        tvWelcome = findViewById(R.id.tv_welcome);
        tvTotalOrders = findViewById(R.id.tv_total_orders);
        tvTotalUsers = findViewById(R.id.tv_total_users);
        tvTotalRevenue = findViewById(R.id.tv_total_revenue);
        tvTotalServices = findViewById(R.id.tv_total_services);
        
        cardOrders = findViewById(R.id.card_orders);
        cardUsers = findViewById(R.id.card_users);
        cardServices = findViewById(R.id.card_services);
        cardAnalytics = findViewById(R.id.card_analytics);
        
        btnLogout = findViewById(R.id.btn_logout);
    }
    
    private void setupData() {
        SharedPreferences prefs = getSharedPreferences("SMM_PREFS", MODE_PRIVATE);
        String username = prefs.getString("username", "Admin");
        
        tvWelcome.setText("Selamat datang, " + username + "!");
        tvTotalOrders.setText(String.format("%,d", totalOrders));
        tvTotalUsers.setText(String.format("%,d", totalUsers));
        tvTotalRevenue.setText(String.format("$%,.2f", totalRevenue));
        tvTotalServices.setText(String.valueOf(totalServices));
    }
    
    private void setupListeners() {
        cardOrders.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(MainActivity.this, OrderActivity.class));
            }
        });
        
        cardUsers.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(MainActivity.this, UserActivity.class));
            }
        });
        
        cardServices.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(MainActivity.this, ServiceActivity.class));
            }
        });
        
        btnLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                performLogout();
            }
        });
    }
    
    private void performLogout() {
        SharedPreferences prefs = getSharedPreferences("SMM_PREFS", MODE_PRIVATE);
        prefs.edit().clear().apply();
        
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}
