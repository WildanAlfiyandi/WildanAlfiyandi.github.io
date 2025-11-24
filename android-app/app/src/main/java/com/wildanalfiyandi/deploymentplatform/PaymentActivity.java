package com.wildanalfiyandi.deploymentplatform;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

public class PaymentActivity extends Activity {

    private EditText amountInput;
    private RadioGroup paymentMethodGroup;
    private Button payButton;
    private TextView qrisInfoText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payment);

        amountInput = findViewById(R.id.amount_input);
        paymentMethodGroup = findViewById(R.id.payment_method_group);
        payButton = findViewById(R.id.pay_button);
        qrisInfoText = findViewById(R.id.qris_info_text);

        paymentMethodGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                updatePaymentInfo(checkedId);
            }
        });

        payButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                processPayment();
            }
        });
    }

    private void updatePaymentInfo(int checkedId) {
        String info = "";
        if (checkedId == R.id.qris_radio) {
            info = "Scan QR Code untuk pembayaran (Mock - memerlukan payment gateway)";
        } else if (checkedId == R.id.dana_radio) {
            info = "Transfer ke Dana (Mock - memerlukan Dana API)";
        } else if (checkedId == R.id.gopay_radio) {
            info = "Transfer ke GoPay (Mock - memerlukan GoPay API)";
        } else if (checkedId == R.id.ovo_radio) {
            info = "Transfer ke OVO (Mock - memerlukan OVO API)";
        }
        qrisInfoText.setText(info);
    }

    private void processPayment() {
        String amount = amountInput.getText().toString().trim();
        int selectedId = paymentMethodGroup.getCheckedRadioButtonId();

        if (amount.isEmpty()) {
            Toast.makeText(this, "Mohon isi jumlah pembayaran", Toast.LENGTH_SHORT).show();
            return;
        }

        if (selectedId == -1) {
            Toast.makeText(this, "Mohon pilih metode pembayaran", Toast.LENGTH_SHORT).show();
            return;
        }

        RadioButton selectedMethod = findViewById(selectedId);
        String method = selectedMethod.getText().toString();

        // Mock payment processing
        Toast.makeText(this, "Memproses pembayaran Rp " + amount + " via " + method + "...", Toast.LENGTH_SHORT).show();
        
        // Simulate payment success
        new android.os.Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(PaymentActivity.this, "Pembayaran berhasil! (Mock)", Toast.LENGTH_SHORT).show();
                finish();
            }
        }, 2000);
    }
}
