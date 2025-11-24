package com.wildanalfiyandi.deploymentplatform;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class AdminPanelActivity extends Activity {

    private EditText websiteUrlInput, websiteFilesInput;
    private Button deployButton, spotifyButton, analyticsButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_panel);

        websiteUrlInput = findViewById(R.id.website_url_input);
        websiteFilesInput = findViewById(R.id.website_files_input);
        deployButton = findViewById(R.id.deploy_button);
        spotifyButton = findViewById(R.id.spotify_button);
        analyticsButton = findViewById(R.id.analytics_button);

        deployButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                deployWebsite();
            }
        });

        spotifyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openSpotifyPlayer();
            }
        });

        analyticsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(AdminPanelActivity.this, "Analytics Dashboard (Mock)", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void deployWebsite() {
        String url = websiteUrlInput.getText().toString().trim();
        
        if (url.isEmpty()) {
            Toast.makeText(this, "Mohon isi URL website", Toast.LENGTH_SHORT).show();
            return;
        }

        // Mock deployment process
        Toast.makeText(this, "Deploying website: " + url, Toast.LENGTH_SHORT).show();
        
        new android.os.Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(AdminPanelActivity.this, "Website deployed successfully! (Mock)", Toast.LENGTH_SHORT).show();
            }
        }, 2000);
    }

    private void openSpotifyPlayer() {
        // Mock Spotify player - in production would use Spotify Android SDK
        Toast.makeText(this, "Spotify Player (memerlukan Spotify SDK & API Key)", Toast.LENGTH_SHORT).show();
        // Could open a simple WebView with Spotify Web Player as alternative
    }
}
